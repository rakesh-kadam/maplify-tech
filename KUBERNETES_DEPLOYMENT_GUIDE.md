# Kubernetes Deployment Guide - Maplify Tech

## 🚀 Quick Deployment

### Prerequisites
- Kubernetes cluster (1.23+)
- kubectl configured
- cert-manager (for TLS certificates)
- NGINX Ingress Controller

### Step 1: Create Namespace
```bash
kubectl create namespace maplify-tech
```

### Step 2: Create Secrets
```bash
# Generate strong JWT secret
JWT_SECRET=$(openssl rand -base64 32)

# Create secrets
kubectl create secret generic maplify-tech-secrets \
  --from-literal=JWT_SECRET="$JWT_SECRET" \
  --from-literal=DATABASE_URL="postgresql://maplify:CHANGE_THIS_PASSWORD@postgres:5432/maplify" \
  --from-literal=MINIO_ACCESS_KEY="CHANGE_THIS_KEY" \
  --from-literal=MINIO_SECRET_KEY="CHANGE_THIS_SECRET" \
  -n maplify-tech
```

### Step 3: Deploy All Resources
```bash
kubectl apply -k infrastructure/kubernetes/base/
```

### Step 4: Check Status
```bash
# Check all resources
kubectl get all -n maplify-tech

# Check ingress
kubectl get ingress -n maplify-tech

# Check pods
kubectl get pods -n maplify-tech
```

## 🌐 Domain Configuration

### DNS Setup Required

Point your domains to your Kubernetes cluster's ingress IP:

```bash
# Get your ingress IP
kubectl get ingress -n maplify-tech -o jsonpath='{.items[0].status.loadBalancer.ingress[0].ip}'
```

#### DNS Records to Create:
```
Type    Name                Value
----    ----                -----
A       www.maplifytech.com  <INGRESS_IP>
A       api.maplifytech.com  <INGRESS_IP>
```

Or if using CNAME:
```
Type    Name                Value
----    ----                -----
CNAME   www.maplifytech.com  your-cluster.example.com
CNAME   api.maplifytech.com  your-cluster.example.com
```

## 🔒 TLS/SSL Certificates

### Automatic with cert-manager (Recommended)

1. **Install cert-manager**:
```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml
```

2. **Create ClusterIssuer** (Let's Encrypt):
```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your-email@example.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
```

```bash
kubectl apply -f cert-issuer.yaml
```

Certificates will be automatically issued for:
- www.maplifytech.com
- api.maplifytech.com

## 📊 Updated Kubernetes Resources

All resources have been updated with Maplify Tech branding:

### Namespace
- **Name**: `maplify-tech`

### Deployments
- **API**: `maplify-tech-api`
  - Image: `your-registry/maplify-tech-api:latest`
  - Replicas: 3-20 (HPA)
  - Port: 8787

- **Web**: `maplify-tech-web`
  - Image: `your-registry/maplify-tech-web:latest`
  - Replicas: 2-10 (HPA)
  - Port: 80

### Services
- **API Service**: `maplify-tech-api:8787`
- **Web Service**: `maplify-tech-web:80`
- **PostgreSQL**: `postgres:5432`
- **MinIO**: `minio:9000`

### ConfigMap
- **Name**: `maplify-tech-config`
- **CORS_ORIGIN**: `https://www.maplifytech.com`
- **DB_NAME**: `maplify`

### Secrets
- **Name**: `maplify-tech-secrets`
- Contains: JWT_SECRET, DATABASE_URL, MinIO credentials

### Ingress
- **Name**: `maplify-tech-ingress`
- **Hosts**:
  - `www.maplifytech.com` → maplify-tech-web:80
  - `api.maplifytech.com` → maplify-tech-api:8787
- **TLS**: Automatic via cert-manager
- **Secret**: `maplify-tech-tls`

## 🔧 Environment Variables

### API Deployment
```yaml
env:
- name: PORT
  value: "8787"
- name: NODE_ENV
  value: "production"
- name: CORS_ORIGIN
  value: "https://www.maplifytech.com"
```

Plus values from ConfigMap (`maplify-tech-config`) and Secrets (`maplify-tech-secrets`).

## 📝 Deployment Commands

### Deploy Everything
```bash
kubectl apply -k infrastructure/kubernetes/base/
```

### Deploy Individual Resources
```bash
kubectl apply -f infrastructure/kubernetes/base/namespace.yaml
kubectl apply -f infrastructure/kubernetes/base/configmap.yaml
kubectl apply -f infrastructure/kubernetes/base/secrets.yaml
kubectl apply -f infrastructure/kubernetes/base/postgres-statefulset.yaml
kubectl apply -f infrastructure/kubernetes/base/minio-deployment.yaml
kubectl apply -f infrastructure/kubernetes/base/api-deployment.yaml
kubectl apply -f infrastructure/kubernetes/base/web-deployment.yaml
kubectl apply -f infrastructure/kubernetes/base/ingress.yaml
```

### Update Deployment
```bash
# Update API image
kubectl set image deployment/maplify-tech-api api=your-registry/maplify-tech-api:v1.1.0 -n maplify-tech

# Update Web image
kubectl set image deployment/maplify-tech-web web=your-registry/maplify-tech-web:v1.1.0 -n maplify-tech
```

### Scale Deployments
```bash
# Manual scaling
kubectl scale deployment maplify-tech-api --replicas=5 -n maplify-tech
kubectl scale deployment maplify-tech-web --replicas=3 -n maplify-tech
```

### View Logs
```bash
# API logs
kubectl logs -f deployment/maplify-tech-api -n maplify-tech

# Web logs
kubectl logs -f deployment/maplify-tech-web -n maplify-tech

# All logs with labels
kubectl logs -l app=maplify-tech-api -n maplify-tech --tail=100
```

### Check Health
```bash
# API health
kubectl exec -it deployment/maplify-tech-api -n maplify-tech -- curl http://localhost:8787/health

# API ready
kubectl exec -it deployment/maplify-tech-api -n maplify-tech -- curl http://localhost:8787/ready
```

## 🎯 Resource Requirements

| Component | Min CPU | Min Memory | Max CPU | Max Memory |
|-----------|---------|------------|---------|------------|
| API | 200m | 256Mi | 500m | 512Mi |
| Web | 100m | 128Mi | 200m | 256Mi |
| PostgreSQL | 250m | 256Mi | 1000m | 1Gi |
| MinIO | 500m | 512Mi | 2000m | 2Gi |

**Total Minimum**: ~1 CPU, ~1.5GB RAM

## 🔄 Auto-Scaling Configuration

### API HPA
- Min: 3 replicas
- Max: 20 replicas
- CPU target: 70%
- Memory target: 80%

### Web HPA
- Min: 2 replicas
- Max: 10 replicas
- CPU target: 70%

## 🗄️ Storage

### PostgreSQL
- **StorageClass**: default
- **Size**: 10Gi
- **Access**: ReadWriteOnce
- **PVC**: postgres-data

### MinIO
- **StorageClass**: default
- **Size**: 50Gi
- **Access**: ReadWriteOnce
- **PVC**: minio-data

## 🔍 Troubleshooting

### Pods Not Starting
```bash
# Check pod status
kubectl get pods -n maplify-tech

# Describe problematic pod
kubectl describe pod <pod-name> -n maplify-tech

# Check events
kubectl get events -n maplify-tech --sort-by='.lastTimestamp'
```

### Ingress Not Working
```bash
# Check ingress
kubectl describe ingress maplify-tech-ingress -n maplify-tech

# Check ingress controller logs
kubectl logs -n ingress-nginx -l app.kubernetes.io/component=controller
```

### Certificate Issues
```bash
# Check certificates
kubectl get certificate -n maplify-tech

# Check certificate details
kubectl describe certificate maplify-tech-tls -n maplify-tech

# Check cert-manager logs
kubectl logs -n cert-manager -l app=cert-manager
```

### Database Connection Issues
```bash
# Check PostgreSQL is running
kubectl get statefulset postgres -n maplify-tech

# Test connection
kubectl exec -it postgres-0 -n maplify-tech -- psql -U maplify -d maplify -c "SELECT version();"
```

## 🧹 Cleanup

### Delete Everything
```bash
# Delete all resources
kubectl delete -k infrastructure/kubernetes/base/

# Delete namespace
kubectl delete namespace maplify-tech

# Delete persistent volumes (WARNING: This deletes all data!)
kubectl delete pv --all
```

### Delete Specific Resources
```bash
# Delete deployments only
kubectl delete deployment maplify-tech-api maplify-tech-web -n maplify-tech

# Delete ingress
kubectl delete ingress maplify-tech-ingress -n maplify-tech
```

## 🎉 Post-Deployment

After successful deployment:

1. **Verify domains resolve**:
   ```bash
   nslookup www.maplifytech.com
   nslookup api.maplifytech.com
   ```

2. **Test HTTPS access**:
   ```bash
   curl -I https://www.maplifytech.com
   curl -I https://api.maplifytech.com/health
   ```

3. **Create first user**:
   - Visit https://www.maplifytech.com
   - Click "Sign Up"
   - Create your account

4. **Monitor resources**:
   ```bash
   kubectl top pods -n maplify-tech
   kubectl top nodes
   ```

---

**Your Maplify Tech instance is now live!** 🚀

Access at: **https://www.maplifytech.com**
