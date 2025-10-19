"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function ContactUs() {
  return (
    <div className="p-4 md:p-8 lg:p-16 mx-auto max-w-7xl">
      <div className="pointer-events-none absolute -top-24 left-1/2 lg:h-[600px] h-[300px] lg:w-[900px] w-[400px] -translate-x-1/2 rounded-full bg-[linear-gradient(90deg,#9747FF80_0%,#9747FF80_50%,#FFCC0080_50%,#FFCC0080_100%)] blur-3xl opacity-20" />
      {/* ===== div2 ===== */}
      <div className="text-center overflow-hidden mb-20 relative">
        
        <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
        <p className="max-w-2xl mx-auto text-[#464747]">
          We’re here to help! Reach out to our team for inquiries, support, or
          feedback, and we’ll get back to you as soon as possible
        </p>
      </div>

      {/* Contact section in grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left card over image */}
        <div className="relative">
          <Image
            src="/backd.png"
            alt="Background"
            width={600}
            height={650}
            className="object-cover rounded-xl w-full h-[400px] lg:h-[500px]"
          />
          <Card className="absolute top-28 left-4  md:left-18 w-[300px] rounded-2xl p-6 bg-white/80 backdrop-blur-md border border-white/30 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center text-black">
                Come See Us
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 text-sm">
              <div className="relative border-l-2 border-white/50 pl-6 space-y-6">
                <div className="relative flex gap-4">
                  <div className="absolute -left-8 top-1 w-3 h-3 rounded-full bg-black border-2 border-white shadow"></div>
                  <div>
                    <h1 className="font-bold">Address</h1>
                    <div className="flex gap-2">
                      <MapPin className="w-5 h-5 text-black shrink-0" />
                      <p>New York, USA</p>
                    </div>
                  </div>
                </div>
                <div className="relative flex gap-4">
                  <div className="absolute -left-8 top-1 w-3 h-3 rounded-full bg-black border-2 border-white shadow"></div>
                  <div>
                    <h1 className="font-bold">Email</h1>
                    <div className="flex gap-2">
                      <Mail className="w-5 h-5 text-black shrink-0" />
                      <p>hello@example.com</p>
                    </div>
                  </div>
                </div>
                <div className="relative flex gap-4">
                  <div className="absolute -left-8 top-1 w-3 h-3 rounded-full bg-black border-2 border-white shadow"></div>
                  <div>
                    <h1 className="font-bold">Phone</h1>
                    <div className="flex gap-2">
                      <Phone className="w-5 h-5 text-black shrink-0" />
                      <p>+1 (234) 567-890</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right form card */}
        <Card className="w-full rounded-2xl  bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Get in touch</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <label className="text-sm font-medium leading-none mb-2">
                Your Name
              </label>
              <Input placeholder="Enter Your Name" />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium leading-none mb-2">
                Your Email <span className="text-destructive">*</span>
              </label>
              <Input placeholder="Enter Your Email" required />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium leading-none mb-2">
                Subject <span className="text-destructive">*</span>
              </label>
              <Input placeholder="Enter Your Subject" required />
            </div>
            <div className="space-y-3 mb-5">
              <label className="text-sm font-medium leading-none pb-2">
                Message <span className="text-destructive">*</span>
              </label>
              <Textarea
                placeholder="Write your message here"
                className="min-h-[100px]"
                required
              />
            </div>
            <Button className="w-28 px-4" type="submit">
              Send Message
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* ===== div1 (bottom) ===== */}
      <div className="mt-16">
        <div className="w-full h-[400px]">
          <Image
            src="https://i.ibb.co.com/pjBVbhJS/Group-36384.png"
            alt="Background"
            width={1200}
            height={400}
            className="object-contain rounded-xl w-full h-full"
          />
        </div>
        <div className="bg-background flex items-center justify-center p-4">
          <div className="w-full max-w-lg space-y-4">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-medium text-foreground">
                Have any other questions?
              </h2>
              <p className="text-sm text-muted-foreground">
                Don’t hesitate to send us an email with your enquiry or statement at
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <Input
                placeholder="What's on Your Mind?"
                className="flex-1 bg-muted border-0 text-foreground placeholder:text-muted-foreground"
              />
              <Button className="bg-foreground text-background hover:bg-foreground/90 px-6 mt-2 sm:mt-0">
                Send Us
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
