import Link from "next/link";
import { CheckCircle } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card";

export default function SubscriptionSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl">Subscription Activated!</CardTitle>
          <CardDescription>
            Your subscription has been successfully activated. You now have
            access to all premium features.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Link href="/prompts">
              <Button className="w-full" size="lg">
                Start Creating
              </Button>
            </Link>

            <Link href="/settings">
              <Button variant="outline" className="w-full" size="lg">
                View Subscription
              </Button>
            </Link>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            You can manage your subscription anytime from your settings page.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
