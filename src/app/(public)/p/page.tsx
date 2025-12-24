import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";

const PublicPage = async () => {
   return (
      <div
         className="min-h-screen w-full bg-gradient-to-br from-background via-background to-primary/5"
         data-testid="public-page"
      >
         {/* Hero Section */}
         <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="max-w-6xl mx-auto">
               {/* Header with Logo and Auth Buttons */}
               <div className="flex justify-between items-center mb-16">
                  <div className="flex items-center gap-3">
                     <Image
                        src="/images/logo.svg"
                        width={50}
                        height={50}
                        alt={`${APP_NAME} logo`}
                        priority={true}
                        className="drop-shadow-lg"
                     />
                     <h1 className="text-2xl font-bold">{APP_NAME}</h1>
                  </div>
                  <div className="flex gap-3">
                     <Button variant="outline" asChild>
                        <Link href="/sign-in">Sign In</Link>
                     </Button>
                     <Button asChild>
                        <Link href="/sign-up">Get Started</Link>
                     </Button>
                  </div>
               </div>

               {/* Hero Content */}
               <div className="text-center space-y-8 mb-20">
                  <div className="space-y-4">
                     <h2 className="text-5xl md:text-6xl font-bold tracking-tight">
                        Welcome to {APP_NAME}
                     </h2>
                     <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                        {APP_DESCRIPTION}
                     </p>
                  </div>
                  <div className="flex gap-4 justify-center flex-wrap">
                     <Button size="lg" asChild>
                        <Link href="/sign-up">Start Free Trial</Link>
                     </Button>
                     <Button size="lg" variant="outline" asChild>
                        <Link href="/p/marketplace">Browse Marketplace</Link>
                     </Button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default PublicPage;
