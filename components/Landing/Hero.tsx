'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/UI/button';
import { ArrowRight, MessageSquare, BarChart3 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function Hero() {
  const router = useRouter();

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />

      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 left-10 w-4 h-4 bg-primary/30 rounded-full"
        animate={{
          y: [0, -20, 0],
          opacity: [0.3, 0.8, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute top-40 right-20 w-6 h-6 bg-secondary/40 rounded-full"
        animate={{
          y: [0, 20, 0],
          opacity: [0.4, 0.9, 0.4],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="text-center max-w-4xl mx-auto"
        >
          <motion.h1
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-6"
          >
            Intelligent
            <br />
            <span className="text-primary">Chat Dashboards</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed"
          >
            Transform conversations into insights with AI-powered analytics and customizable
            dashboard experiences.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              size="lg"
              onClick={() => router.push('/chat')}
              className="group text-lg px-8 py-6"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Start Chatting
              <motion.div
                className="ml-2"
                whileHover={{ x: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <ArrowRight className="h-5 w-5" />
              </motion.div>
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push('/dashboard')}
              className="text-lg px-8 py-6"
            >
              <BarChart3 className="mr-2 h-5 w-5" />
              View Dashboard
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
