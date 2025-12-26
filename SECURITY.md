# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Currently supported versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of Maplify Tech seriously. If you believe you have found a security vulnerability, please report it to us responsibly.

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to: **security@yourdomain.com** (replace with your email)

You should receive a response within 48 hours. If for some reason you do not, please follow up via email to ensure we received your original message.

Please include the following information:

- Type of issue (e.g., buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the issue
- Location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

## Security Best Practices

### For Production Deployments

#### 1. Change Default Secrets

**Never use default secrets in production!**

```bash
# Generate strong JWT secret
openssl rand -base64 32

# Generate strong database password
openssl rand -base64 24

# Generate strong MinIO credentials
openssl rand -base64 16
```

Update these in your `.env` files or Kubernetes secrets:
- `JWT_SECRET` - At least 32 characters
- `DATABASE_URL` - Strong database password
- `MINIO_SECRET_KEY` - At least 16 characters

#### 2. Use HTTPS/TLS

Always use HTTPS in production. With Kubernetes:

```bash
# Install cert-manager for automatic TLS certificates
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Configure Let's Encrypt issuer
kubectl apply -f infrastructure/kubernetes/base/cert-issuer.yaml
```

#### 3. Enable Network Policies

Restrict pod-to-pod communication:

```bash
kubectl apply -f infrastructure/kubernetes/base/network-policy.yaml
```

#### 4. Use Non-Root Containers

All Maplify Tech containers run as non-root users by default. Verify with:

```bash
docker inspect maplify-tech-api:latest | grep -A 5 "User"
```

#### 5. Keep Dependencies Updated

```bash
# Update npm dependencies
pnpm update

# Check for vulnerabilities
pnpm audit

# Fix vulnerabilities
pnpm audit fix
```

#### 6. Secure Environment Variables

**Never commit `.env` files to git!**

For Kubernetes, use secrets:

```bash
kubectl create secret generic maplify-tech-secrets \
  --from-literal=JWT_SECRET="your-secret-here" \
  --from-literal=DATABASE_URL="postgresql://..." \
  -n maplify-tech
```

For Docker Compose, use `.env` files (which are in `.gitignore`):

```bash
cp apps/api/.env.example apps/api/.env
# Edit and add strong secrets
```

#### 7. Enable CORS Properly

Configure CORS to only allow your frontend domain:

```env
# apps/api/.env
CORS_ORIGIN=https://your-domain.com
```

#### 8. Database Security

- Use strong passwords
- Enable SSL/TLS connections
- Restrict database access to backend pods only
- Regular backups with encryption

```bash
# PostgreSQL with TLS
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
```

#### 9. MinIO Security

- Change default access/secret keys
- Enable TLS
- Use bucket policies to restrict access
- Enable audit logging

```bash
# MinIO with TLS
MINIO_USE_SSL=true
```

#### 10. Resource Limits

Prevent DoS attacks with resource limits:

```yaml
resources:
  requests:
    memory: "256Mi"
    cpu: "200m"
  limits:
    memory: "512Mi"
    cpu: "500m"
```

### Authentication & Authorization

#### Password Security

- Passwords are hashed using bcrypt (12 rounds)
- Minimum password length: 8 characters
- Enforce strong passwords in production

#### JWT Tokens

- Tokens expire after 24 hours
- Stored securely in HTTP-only cookies (recommended) or localStorage
- Refresh token mechanism (implement if needed)

#### Session Management

- Sessions stored in PostgreSQL
- Automatic cleanup of expired sessions
- Logout invalidates tokens

### Input Validation

All API endpoints use Zod schemas for validation:

```typescript
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
```

### SQL Injection Prevention

Using Prisma ORM prevents SQL injection:

```typescript
// Safe - parameterized queries
await prisma.user.findUnique({ where: { email } });
```

### XSS Prevention

- React automatically escapes content
- Sanitize user input
- Use Content Security Policy headers

### CSRF Protection

Implement CSRF tokens for state-changing operations.

## Security Checklist for Self-Hosting

- [ ] Changed all default passwords and secrets
- [ ] Enabled HTTPS/TLS with valid certificates
- [ ] Configured firewall rules
- [ ] Set up regular database backups
- [ ] Enabled network policies (Kubernetes)
- [ ] Configured CORS properly
- [ ] Set resource limits
- [ ] Updated all dependencies
- [ ] Reviewed application logs
- [ ] Set up monitoring and alerts
- [ ] Restricted database access
- [ ] Enabled MinIO access policies
- [ ] Configured proper RBAC (Kubernetes)

## Known Security Considerations

### Current Limitations

1. **No Rate Limiting**: Implement rate limiting for production
2. **No 2FA**: Two-factor authentication not yet implemented
3. **Session Storage**: Consider Redis for session storage at scale

### Recommended Additions

1. **Rate Limiting**: Use nginx or middleware
2. **WAF**: Web Application Firewall (Cloudflare, AWS WAF)
3. **DDoS Protection**: Use cloud provider protections
4. **Monitoring**: Prometheus + Grafana for security metrics

## Security Updates

We will disclose security vulnerabilities after:

1. A fix has been released
2. Sufficient time has passed for users to update (typically 30 days)
3. Coordination with affected parties

Security advisories will be published in:

- GitHub Security Advisories
- Release notes
- This SECURITY.md file

## Responsible Disclosure

We follow a responsible disclosure policy:

1. Report received and acknowledged (48 hours)
2. Issue validated and reproduced (1 week)
3. Fix developed and tested (2-4 weeks)
4. Security advisory prepared
5. Fix released with security patch
6. Public disclosure (30 days after patch)

## Bug Bounty

Currently, we do not have a bug bounty program. However, we deeply appreciate security researchers and will acknowledge contributors in our security hall of fame.

## Security Hall of Fame

We thank the following security researchers:

<!-- Contributors will be listed here -->

---

**Last Updated**: 2024-12-24
