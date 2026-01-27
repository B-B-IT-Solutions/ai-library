# Subscription System Setup Guide

This guide will help you set up the subscription system with Stripe.

## Environment Variables

Add the following variables to your `.env` file:

```env
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_... # Your Stripe secret key
STRIPE_WEBHOOK_SECRET=whsec_... # Your Stripe webhook secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... # Your Stripe publishable key

# Subscription Plan IDs (set after running seed script)
STRIPE_FREE_PLAN_ID=<uuid-from-database>
STRIPE_BASIC_PLAN_ID=<uuid-from-database>
STRIPE_PRO_PLAN_ID=<uuid-from-database>
```

## Database Setup

### 1. Run Database Migration

The Prisma schema has been updated with subscription models. Apply the changes:

```bash
npx prisma db push
```

Or create a migration:

```bash
npx prisma migrate dev --name add_subscription_models
```

### 2. Seed Subscription Plans

Run the seed script to create the initial subscription plans:

```bash
npm run db:seed
```

This will create three plans:
- **FREE**: CHF 0
- **BASIC**: CHF 9.90/month, CHF 99/year
- **PRO**: CHF 19.90/month, CHF 199/year

### 3. Get Plan IDs

After seeding, query the database to get the plan UUIDs:

```sql
SELECT id, tier FROM subscription_plan;
```

Update your `.env` file with these IDs.

## Stripe Configuration

### 1. Create Products in Stripe Dashboard

Go to [Stripe Dashboard](https://dashboard.stripe.com/test/products) and create:

1. **Basic Subscription**
   - Name: "Basic Subscription"
   - Description: "Perfect for individuals and small teams"

2. **Pro Subscription**
   - Name: "Pro Subscription"
   - Description: "Unlimited access for power users"

### 2. Create Prices

For each product, create two prices:

**Basic Subscription:**
- Monthly: CHF 9.90, recurring monthly
- Yearly: CHF 99.00, recurring yearly

**Pro Subscription:**
- Monthly: CHF 19.90, recurring monthly
- Yearly: CHF 199.00, recurring yearly

### 3. Update Database with Stripe IDs

After creating products and prices in Stripe, update the database:

```sql
-- Update BASIC plan
UPDATE subscription_plan
SET
  stripe_product_id = 'prod_...',
  stripe_price_id_monthly = 'price_...',
  stripe_price_id_yearly = 'price_...'
WHERE tier = 'BASIC';

-- Update PRO plan
UPDATE subscription_plan
SET
  stripe_product_id = 'prod_...',
  stripe_price_id_monthly = 'price_...',
  stripe_price_id_yearly = 'price_...'
WHERE tier = 'PRO';
```

### 4. Configure Customer Portal

1. Go to [Stripe Customer Portal Settings](https://dashboard.stripe.com/test/settings/billing/portal)
2. Enable the following features:
   - Update payment method
   - View billing history
   - Cancel subscription
3. Set cancellation behavior to "Cancel at period end"

### 5. Setup Webhook

1. Go to [Stripe Webhooks](https://dashboard.stripe.com/test/webhooks)
2. Click "Add endpoint"
3. Set endpoint URL: `https://your-domain.com/api/webhooks/stripe`
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the webhook signing secret and add to `.env` as `STRIPE_WEBHOOK_SECRET`

## Testing Locally

### 1. Install Stripe CLI

Download from [Stripe CLI](https://stripe.com/docs/stripe-cli)

### 2. Login to Stripe

```bash
stripe login
```

### 3. Forward Webhooks to Local Server

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

This will give you a webhook secret - add it to your `.env` file.

### 4. Test Subscriptions

Use Stripe test cards:
- **Success**: `4242 4242 4242 4242`
- **Declined**: `4000 0000 0000 0002`

### 5. Trigger Test Events

```bash
# Test subscription created
stripe trigger customer.subscription.created

# Test invoice payment succeeded
stripe trigger invoice.payment_succeeded

# Test invoice payment failed
stripe trigger invoice.payment_failed
```

## Verification Checklist

After setup, verify:

- [ ] Database migration applied successfully
- [ ] Subscription plans seeded
- [ ] Stripe products and prices created
- [ ] Database updated with Stripe IDs
- [ ] Environment variables set
- [ ] Webhook endpoint configured
- [ ] Customer portal enabled
- [ ] Can view pricing page at `/subscription/pricing`
- [ ] Can create subscription checkout
- [ ] Can view subscription in settings
- [ ] Can cancel subscription
- [ ] Can reactivate subscription
- [ ] Can access customer portal
- [ ] Webhooks update subscription status
- [ ] Access control works based on tier

## Features Overview

### Subscription Tiers

**FREE Tier:**
- 5 prompts max
- 3 library items max
- Marketplace access
- No purchases
- No exports
- No advanced features

**BASIC Tier:**
- 50 prompts max
- 20 library items max
- Marketplace access
- Can purchase items
- Can export prompts
- No advanced features

**PRO Tier:**
- Unlimited prompts
- Unlimited library items
- Marketplace access
- Can purchase items
- Can export prompts
- Advanced features

### Access Control

Server-side guards:
```typescript
import { requireSubscriptionAccess } from "@/lib/subscription/server-guards";

// In your server action or API route
await requireSubscriptionAccess("canPurchaseItems");
```

Client-side hook:
```typescript
import { useSubscription } from "@/hooks/use-subscription";

export const MyComponent = () => {
  const { tier, canAccessFeature } = useSubscription();

  if (!canAccessFeature("canPurchaseItems")) {
    return <UpgradePrompt />;
  }

  return <PremiumFeature />;
};
```

## Troubleshooting

### Webhooks Not Working

1. Check webhook secret is correct in `.env`
2. Verify endpoint URL is accessible
3. Check Stripe Dashboard > Webhooks for failed events
4. View webhook logs in Stripe Dashboard

### Subscription Not Activating

1. Check webhook for `checkout.session.completed` was received
2. Verify Stripe subscription ID is stored in database
3. Check subscription status in database
4. Review server logs for errors

### Customer Portal Not Opening

1. Ensure customer portal is configured in Stripe
2. Verify user has active subscription
3. Check stripeCustomerId is set for user

## Production Deployment

Before going live:

1. Switch to live Stripe keys (remove `_test_` from keys)
2. Update webhook endpoint to production URL
3. Test all flows with real cards (then refund)
4. Set up monitoring for failed webhooks
5. Configure backup payment method collection
6. Set up email notifications for subscription events

## Support

For issues or questions:
- Check Stripe documentation: https://stripe.com/docs
- Review Stripe logs in Dashboard
- Check application logs for errors
- Verify database state matches Stripe state
