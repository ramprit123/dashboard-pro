'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/UI/button';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function CTA() {
  const router = useRouter();

  return (
    <section className="py-24 bg-background text-primary">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Data?</h2>
          <p className="text-xl opacity-90 mb-8">
            Join thousands of users who are already building better experiences with intelligent
            chat and dashboard solutions.
          </p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            whileHover={{ scale: 1.02 }}
          >
            <Button
              size="lg"
              variant="secondary"
              onClick={() => router.push('/chat')}
              className="text-lg px-8 py-6 group"
            >
              Get Started Now
              <motion.div
                className="ml-2"
                whileHover={{ x: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <ArrowRight className="h-5 w-5" />
              </motion.div>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
