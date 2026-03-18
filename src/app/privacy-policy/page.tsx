import { AppHeader } from "@/components/app-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col h-screen">
      <AppHeader title="Privacy Policy" />
      <main className="flex-1 container mx-auto p-4 md:p-6 overflow-y-auto">
        <Card>
          <CardHeader>
            <CardTitle>Privacy Policy for Islamic Daily Companion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 prose dark:prose-invert max-w-none">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            <p>
              Your privacy is important to us. It is Islamic Daily Companion's
              policy to respect your privacy regarding any information we may
              collect from you through our app.
            </p>
            <h3 className="font-semibold text-lg">Information We Collect</h3>
            <p>
              We only ask for personal information when we truly need it to
              provide a service to you. We collect it by fair and lawful means,
              with your knowledge and consent. We also let you know why we’re
              collecting it and how it will be used.
            </p>
            <p>
              For the Prayer Times feature, we may ask for your city or use your device's
              location to provide accurate timings. This information is used solely
              for this purpose and is not stored on our servers. For the Qibla Direction
              feature, we use your device's compass and orientation sensors. This data
              is processed on your device and is not transmitted or stored.
            </p>
            <h3 className="font-semibold text-lg">Third-Party Services</h3>
            <p>
              Our app may display ads from third-party networks. These networks may
              use technology to receive your IP address. They may also use other
              technologies (such as cookies) to measure the effectiveness of their
              advertisements and/or to personalize the advertising content that
              you see.
            </p>
            <h3 className="font-semibold text-lg">Security</h3>
            <p>
              We value your trust in providing us your Personal Information, thus
              we are striving to use commercially acceptable means of protecting
              it. But remember that no method of transmission over the internet,
              or method of electronic storage is 100% secure and reliable, and
              we cannot guarantee its absolute security.
            </p>
            <h3 className="font-semibold text-lg">Changes to This Privacy Policy</h3>
            <p>
              We may update our Privacy Policy from time to time. Thus, you are
              advised to review this page periodically for any changes. We will
              notify you of any changes by posting the new Privacy Policy on this
              page.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
