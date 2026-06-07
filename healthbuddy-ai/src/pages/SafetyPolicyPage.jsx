import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DayNightLandscape from '@/components/DayNightLandscape';

const SafetyPolicyPage = () => {
  return (
    <>
      <Helmet>
        <title>Safety Policy - HealthBuddy AI</title>
        <meta name="description" content="Important safety information about what HealthBuddy AI can and cannot help with." />
      </Helmet>
      <Header />

      <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <DayNightLandscape variant="subtle" className="opacity-25" />
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Safety Policy</h1>
            <p className="text-lg text-muted-foreground">
              Important information about what HealthBuddy AI can and cannot help with
            </p>
          </div>

          <Card className="mb-8 border-2 border-destructive/20">
            <CardHeader>
              <CardTitle className="text-destructive">Critical Safety Notice</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="leading-relaxed">
                HealthBuddy AI is a wellness habit tracking and daily routine planning tool. It is <strong>NOT</strong> a medical device, diagnostic tool, or replacement for healthcare professionals.
              </p>
              <p className="leading-relaxed">
                This app does <strong>NOT</strong>:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide medical diagnosis</li>
                <li>Prescribe medication or treatments</li>
                <li>Replace advice from qualified healthcare professionals</li>
                <li>Offer emergency medical assistance</li>
                <li>Treat, cure, or prevent any disease or medical condition</li>
              </ul>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <CheckCircle className="w-5 h-5" />
                  What We CAN Help With
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Daily routine planning and organization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Hydration reminders and tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Posture awareness tips</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Movement and stretch break planning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Sleep routine consistency support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Screen time balance awareness</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Healthy habit tracking and consistency building</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Age-appropriate wellness recommendations</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <XCircle className="w-5 h-5" />
                  What We CANNOT Help With
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <span>Medical diagnosis of any condition</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <span>Prescription medication recommendations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <span>Treatment of injuries or pain</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <span>Breathing difficulties or respiratory issues</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <span>Chest pain or heart-related concerns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <span>Severe mental distress or crisis intervention</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <span>Nutritional deficiency diagnosis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <span>Any medical emergency</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>When to Seek Professional Help</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="leading-relaxed">
                <strong>Seek immediate medical attention if you experience:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Chest pain or pressure</li>
                <li>Difficulty breathing or shortness of breath</li>
                <li>Severe or persistent pain</li>
                <li>Sudden weakness or numbness</li>
                <li>Severe mental distress or thoughts of self-harm</li>
                <li>Any symptoms that concern you</li>
              </ul>
              <p className="leading-relaxed mt-4">
                <strong>Consult a healthcare professional for:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Persistent fatigue or sleep issues</li>
                <li>Chronic pain or discomfort</li>
                <li>Concerns about your health or wellness</li>
                <li>Questions about starting new exercise routines</li>
                <li>Dietary or nutritional guidance</li>
                <li>Mental health support</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Age-Appropriate Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="leading-relaxed">
                HealthBuddy AI provides age-aware recommendations for users from ages 1 to 100. However:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Children should use this app with parental or caregiver supervision</li>
                <li>Caregivers should review all recommendations for appropriateness</li>
                <li>Older adults should consult healthcare providers before changing routines</li>
                <li>Anyone with existing health conditions should seek professional guidance</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mt-8 bg-muted/50">
            <CardContent className="p-6">
              <p className="text-center text-sm text-muted-foreground leading-relaxed">
                By using HealthBuddy AI, you acknowledge that this app is for general wellness support only and does not replace professional medical advice, diagnosis, or treatment. Always consult qualified healthcare professionals for medical concerns.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default SafetyPolicyPage;