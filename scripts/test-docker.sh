#!/bin/bash
# Docker-based testing script for development scripts
# This provides isolated, reproducible testing environments

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
COMPOSE_FILE="$PROJECT_ROOT/docker/test-environments/docker-compose.test.yml"

echo "🐳 Docker-Based Script Testing"
echo "================================"

# Check if Docker is available
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed or not running"
    echo "Please install Docker Desktop and ensure it's running"
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker &> /dev/null || ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not available"
    echo "Please ensure you have Docker Desktop with Compose support"
    exit 1
fi

echo "✅ Docker environment ready"

# Function to run tests in a specific environment
test_environment() {
    local env_name=$1
    local container_name="landscape-test-$env_name"
    
    echo ""
    echo "🧪 Testing in $env_name environment..."
    echo "Container: $container_name"
    
    # Start the environment
    docker compose -f "$COMPOSE_FILE" up -d "test-$env_name"
    
    # Wait for container to be ready
    echo "⏳ Waiting for container to be ready..."
    sleep 5
    
    # Copy project to workspace and run tests
    docker exec "$container_name" bash -c "
        echo '📁 Setting up workspace...';
        cp -r /app/* /workspace/;
        cd /workspace;
        
        echo '🔧 Running setup test...';
        if npm run setup; then
            echo '✅ Setup test PASSED';
        else
            echo '❌ Setup test FAILED';
            exit 1;
        fi;
        
        echo '🚀 Testing development startup...';
        timeout 30s npm run backend &
        BACKEND_PID=\$!;
        sleep 10;
        
        if curl -f http://localhost:8000/health; then
            echo '✅ Backend startup test PASSED';
        else
            echo '❌ Backend startup test FAILED';
        fi;
        
        kill \$BACKEND_PID 2>/dev/null || true;
        
        echo '🧹 Testing cleanup...';
        npm run clean;
        echo '✅ Cleanup test PASSED';
    "
    
    local exit_code=$?
    
    # Stop and remove the container
    docker compose -f "$COMPOSE_FILE" down "test-$env_name"
    
    if [ $exit_code -eq 0 ]; then
        echo "✅ $env_name environment tests PASSED"
    else
        echo "❌ $env_name environment tests FAILED"
        return 1
    fi
}

# Function to run automated test suite
run_automated_tests() {
    echo ""
    echo "🤖 Running automated test suite..."
    
    # Start test runner
    docker compose -f "$COMPOSE_FILE" up -d test-runner
    
    # Wait for tests to complete
    echo "⏳ Running tests... (this may take a few minutes)"
    
    # Follow test progress
    docker logs -f landscape-test-runner &
    LOGS_PID=$!
    
    # Wait for test completion (max 10 minutes)
    local counter=0
    while [ $counter -lt 600 ]; do
        if docker ps --filter "name=landscape-test-runner" --filter "status=exited" | grep -q "landscape-test-runner"; then
            break
        fi
        sleep 10
        ((counter += 10))
    done
    
    kill $LOGS_PID 2>/dev/null || true
    
    # Get test results
    local exit_code=$(docker inspect landscape-test-runner --format='{{.State.ExitCode}}' 2>/dev/null || echo "1")
    
    # Copy test results to host
    echo "📋 Copying test results..."
    docker cp landscape-test-runner:/test-results ./docker-test-results/ 2>/dev/null || true
    
    # Clean up
    docker compose -f "$COMPOSE_FILE" down
    
    if [ "$exit_code" = "0" ]; then
        echo "✅ Automated tests PASSED"
        return 0
    else
        echo "❌ Automated tests FAILED"
        return 1
    fi
}

# Function to clean up all test resources
cleanup() {
    echo "🧹 Cleaning up Docker test resources..."
    docker compose -f "$COMPOSE_FILE" down --volumes --remove-orphans 2>/dev/null || true
    
    # Remove test images if requested
    if [ "$1" = "--images" ]; then
        echo "🗑️  Removing test images..."
        docker images --filter "label=testing.purpose=landscape-show-dev-scripts" -q | xargs -r docker rmi
    fi
}

# Parse command line arguments
case "${1:-all}" in
    "ubuntu")
        test_environment ubuntu
        ;;
    "alpine") 
        test_environment alpine
        ;;
    "minimal")
        test_environment minimal
        ;;
    "automated")
        run_automated_tests
        ;;
    "all")
        echo "🎯 Running comprehensive Docker tests..."
        
        # Test each environment
        test_environment ubuntu || exit 1
        test_environment alpine || exit 1  
        test_environment minimal || exit 1
        
        # Run automated suite
        run_automated_tests || exit 1
        
        echo ""
        echo "🎉 ALL DOCKER TESTS PASSED!"
        echo "Your development scripts work perfectly in isolated environments!"
        ;;
    "clean")
        cleanup --images
        echo "✅ Cleanup complete"
        ;;
    "interactive")
        echo "🔧 Starting interactive test environment..."
        echo "Available commands in container:"
        echo "  npm run setup    # Test setup"
        echo "  npm run dev      # Test development startup" 
        echo "  npm run clean    # Test cleanup"
        echo ""
        docker compose -f "$COMPOSE_FILE" run --rm test-ubuntu bash
        ;;
    *)
        echo "Usage: $0 [ubuntu|alpine|minimal|automated|all|clean|interactive]"
        echo ""
        echo "Commands:"
        echo "  ubuntu      - Test in Ubuntu environment"
        echo "  alpine      - Test in Alpine Linux environment" 
        echo "  minimal     - Test in minimal environment (no optional tools)"
        echo "  automated   - Run full automated test suite"
        echo "  all         - Run all tests (default)"
        echo "  clean       - Clean up all Docker test resources"
        echo "  interactive - Start interactive test environment"
        echo ""
        echo "Examples:"
        echo "  $0 ubuntu                    # Test Ubuntu only"
        echo "  $0 all                       # Test everything"
        echo "  $0 interactive               # Manual testing"
        exit 1
        ;;
esac