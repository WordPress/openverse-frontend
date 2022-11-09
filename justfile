set dotenv-load := false

# Show all available recipes
default:
    pnpm run

# Run a pnpm command
run *args:
    pnpm run {{ args }}
    
