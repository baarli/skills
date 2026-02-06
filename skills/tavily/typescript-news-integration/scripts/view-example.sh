#!/bin/bash
# TypeScript News Integration - View Example Files
# Usage: ./view-example.sh [file]

set -e

EXAMPLE_DIR="/home/runner/work/skills/skills/examples/typescript-news-integration"

if [ -z "$1" ]; then
    echo "TypeScript News Integration Example Files"
    echo "=========================================="
    echo ""
    echo "Usage: ./view-example.sh [file]"
    echo ""
    echo "Available files:"
    echo ""
    echo "Documentation:"
    echo "  readme              - Main README with full documentation"
    echo ""
    echo "Core Library:"
    echo "  client              - Main Tavily client implementation"
    echo "  utils               - Utility functions"
    echo "  index               - Library exports"
    echo ""
    echo "Examples:"
    echo "  news-search         - Basic news search example"
    echo "  advanced-search     - Advanced search with filtering"
    echo "  news-monitor        - Real-time news monitoring"
    echo ""
    echo "Configuration:"
    echo "  package             - package.json"
    echo "  tsconfig            - TypeScript configuration"
    echo ""
    echo "Example:"
    echo "  ./view-example.sh client"
    echo "  ./view-example.sh news-search"
    exit 0
fi

FILE_ARG="$1"

case "$FILE_ARG" in
    readme)
        cat "$EXAMPLE_DIR/README.md"
        ;;
    client)
        echo "=== src/lib/tavily/client.ts ==="
        cat "$EXAMPLE_DIR/src/lib/tavily/client.ts"
        ;;
    utils)
        echo "=== src/lib/tavily/utils.ts ==="
        cat "$EXAMPLE_DIR/src/lib/tavily/utils.ts"
        ;;
    index)
        echo "=== src/lib/tavily/index.ts ==="
        cat "$EXAMPLE_DIR/src/lib/tavily/index.ts"
        ;;
    news-search)
        echo "=== src/examples/news-search.ts ==="
        cat "$EXAMPLE_DIR/src/examples/news-search.ts"
        ;;
    advanced-search)
        echo "=== src/examples/advanced-search.ts ==="
        cat "$EXAMPLE_DIR/src/examples/advanced-search.ts"
        ;;
    news-monitor)
        echo "=== src/examples/news-monitor.ts ==="
        cat "$EXAMPLE_DIR/src/examples/news-monitor.ts"
        ;;
    package)
        echo "=== package.json ==="
        cat "$EXAMPLE_DIR/package.json"
        ;;
    tsconfig)
        echo "=== tsconfig.json ==="
        cat "$EXAMPLE_DIR/tsconfig.json"
        ;;
    *)
        echo "Unknown file: $FILE_ARG"
        echo "Run './view-example.sh' without arguments to see available files"
        exit 1
        ;;
esac
