"use client"

import { Mail, MapPin, Clock, Send, User, AtSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function ContactPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground mt-16">
      {/* Hero */}
      <section className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Get in Touch</h1>
          <p className="mt-2 text-white/90">Have questions? We’re here to help you succeed.</p>
        </div>
      </section>

      {/* Contact Section */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Left: Contact Information */}
          <aside className="md:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 rounded-lg border p-3">
                  <div className="mt-0.5 rounded-md bg-primary/10 p-2 text-primary">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">admin@resume.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg border p-3">
                  <div className="mt-0.5 rounded-md bg-primary/10 p-2 text-primary">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">Aligarh, India</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg border p-3">
                  <div className="mt-0.5 rounded-md bg-primary/10 p-2 text-primary">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Working Hours</p>
                    <p className="text-sm text-muted-foreground">Monday to Sunday<br />10 AM to 9 PM</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Right: Form */}
          <section className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="fullName" className="text-sm font-medium">
                        Full Name <span className="text-destructive">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="fullName" placeholder="Your full name" className="pl-9" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email Address <span className="text-destructive">*</span>
                      </label>
                      <div className="relative">
                        <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="email" type="email" placeholder="your@email.com" className="pl-9" required />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Subject</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="support">Product Support</SelectItem>
                        <SelectItem value="billing">Billing</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message <span className="text-destructive">*</span>
                    </label>
                    <Textarea id="message" placeholder="Tell us how we can help you..." rows={6} required />
                  </div>

                  <Button type="submit" className="w-full sm:w-auto">
                    <Send className="mr-2 h-4 w-4" /> Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* FAQ */}
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-semibold">Frequently Asked Questions</h2>
          <Card>
            <CardContent className="p-0">
              <Accordion type="single" collapsible className="divide-y">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="px-6">How do I download my resume?</AccordionTrigger>
                  <AccordionContent className="px-6">
                    Once you’ve completed your resume, click the “Export PDF” button in the builder to download your resume as a high-quality PDF file.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="px-6">Are the templates ATS-friendly?</AccordionTrigger>
                  <AccordionContent className="px-6">
                    Yes! All our templates are designed to be compatible with Applicant Tracking Systems (ATS) used by most companies for initial resume screening.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="px-6">Can I edit my resume after downloading?</AccordionTrigger>
                  <AccordionContent className="px-6">
                    Your resume data is automatically saved in your browser. You can return to the builder anytime to make changes and download an updated version.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger className="px-6">Is ResumeBuilder Pro free to use?</AccordionTrigger>
                  <AccordionContent className="px-6">
                    Yes! All our templates and features are completely free to use. Create professional resumes without any cost or subscription.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger className="px-6">What file formats are supported?</AccordionTrigger>
                  <AccordionContent className="px-6">
                    Currently, we support PDF export, which is the most widely accepted format for job applications. We’re working on adding more formats soon.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}

