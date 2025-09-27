'use client';
import { RegisterForm } from '@/components/register-form';
import { motion } from 'framer-motion';
import { GalleryVerticalEnd } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2 bg-[#f5f5f5]">
      <div className="flex flex-col gap-4 p-4 sm:p-6 md:p-8 lg:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Anabot Pro.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center px-4">
          <motion.div
            className="w-full max-w-sm space-y-6 bg-white p-6 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <RegisterForm />
          </motion.div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/login_image.jpg"
          alt="Login background image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
