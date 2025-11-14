# AWS Hosting Guide for Password Manager

## Application Architecture

This password manager consists of:
- **Frontend**: React SPA (static files)
- **Backend**: Node.js/Express API server
- **Database**: MongoDB

## Recommended AWS Architecture

### Option 1: Simple & Cost-Effective (Recommended for MVP)

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CloudFront    │────│   S3 Bucket     │    │   API Gateway   │
│   (CDN + SSL)   │    │   (Static Site) │    │   (Optional)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                                                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Elastic Bean  │────│   MongoDB       │    │   Route 53      │
│   Stalk (API)   │    │   Atlas         │    │   (DNS)         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Services Needed:
- **S3** + **CloudFront**: Static website hosting
- **Elastic Beanstalk**: Backend API hosting
- **MongoDB Atlas**: Database (external)
- **Route 53**: Domain management
- **Certificate Manager**: SSL certificates

## Step-by-Step Deployment

### 1. Prerequisites
- AWS Account with billing enabled
- Domain name (optional)
- MongoDB Atlas account

### 2. Set up MongoDB Atlas
```bash
# Create cluster in MongoDB Atlas
# Get connection string: mongodb+srv://username:password@cluster.mongodb.net/passwordmanager
```

### 3. Deploy Backend (Elastic Beanstalk)

#### Create EB Application:
```bash
# Install AWS CLI
pip install awscli

# Configure AWS CLI
aws configure

# Create EB application
eb init --platform "Node.js 18" --region us-east-1 password-manager-api

# Create environment
eb create production --sample

# Deploy
eb deploy
```

#### Environment Variables for EB:
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `PORT`: 8080 (EB default)
- `NODE_ENV`: production

### 4. Deploy Frontend (S3 + CloudFront)

#### Create S3 Bucket:
```bash
# Create bucket
aws s3 mb s3://your-password-manager-app

# Enable static website hosting
aws s3 website s3://your-password-manager-app --index-document index.html --error-document index.html

# Upload build files
aws s3 cp client/build/ s3://your-password-manager-app --recursive --acl public-read
```

#### CloudFront Distribution:
```bash
# Create distribution pointing to S3 bucket
# Configure:
# - Origin: S3 bucket
# - Default root object: index.html
# - Price class: Use all edge locations
# - SSL: Redirect HTTP to HTTPS
```

### 5. Connect Frontend to Backend

Update `client/src/utils/api.js` (create if needed):
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-eb-app-url.elasticbeanstalk.com';

export const api = axios.create({
  baseURL: API_BASE_URL,
});
```

### 6. Domain & SSL (Optional)

#### Route 53:
```bash
# Create hosted zone for your domain
aws route53 create-hosted-zone --name "yourdomain.com"

# Add A record pointing to CloudFront distribution
# Add CNAME for API subdomain pointing to EB URL
```

#### Certificate Manager:
- Request SSL certificate for your domain
- Attach to CloudFront distribution

## Security Considerations

### Network Security:
- Use HTTPS everywhere
- Configure CloudFront to block direct S3 access
- Use security groups for EB instances

### Application Security:
- Environment variables for sensitive data
- Regular dependency updates
- Enable AWS WAF for additional protection

### Database Security:
- MongoDB Atlas network restrictions
- Database user with minimal permissions
- Enable encryption at rest

## Cost Estimation (Monthly)

- **S3**: $0.023/GB storage + requests (~$1-5)
- **CloudFront**: $0.085/GB data transfer (~$2-10)
- **Elastic Beanstalk**: t3.micro instance (~$8)
- **MongoDB Atlas**: M0 cluster (~$0, free tier)
- **Route 53**: $0.50/hosted zone (~$0.50)

**Total**: ~$10-25/month for small scale

## Monitoring & Maintenance

### CloudWatch:
- Enable EB health monitoring
- Set up alarms for CPU/memory usage

### Backups:
- MongoDB Atlas automated backups
- Regular EB environment snapshots

### Updates:
- Monitor AWS security bulletins
- Keep dependencies updated
- Regular EB platform updates

## Alternative Architectures

### Option 2: Serverless
- **API Gateway + Lambda**: For backend
- **DynamoDB**: Instead of MongoDB
- **S3 + CloudFront**: Same for frontend

### Option 3: Containerized
- **ECS Fargate**: For backend
- **MongoDB on EC2**: Self-managed
- More complex but scalable

## Troubleshooting

### Common Issues:
1. **CORS errors**: Update EB environment CORS settings
2. **API connection**: Verify environment variables
3. **SSL issues**: Check CloudFront certificate status
4. **MongoDB timeout**: Verify Atlas network access

### Logs:
- EB logs: `eb logs`
- CloudFront: Access logs to S3
- MongoDB: Atlas monitoring dashboard