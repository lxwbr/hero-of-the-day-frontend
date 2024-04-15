# Fail on early and on unset variables in non-shebang recipes
set shell := ["bash", "-euo", "pipefail", "-c"]

upload stage:
    aws s3 sync build/ s3://hero-of-the-day-frontend-{{stage}}

invalidate distribution:
    aws cloudfront create-invalidation --distribution-id {{distribution}} --paths /index.html /service-worker.js,

deploy stage distribution:
    npm run build
    just upload {{stage}}
    just invalidate {{distribution}}