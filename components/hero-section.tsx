'use client';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/UI/button';
import { Menu, X, ArrowRight, MessageSquare, BarChart3 } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/UI/ThemeToggle';

const menuItems = [
  { name: 'Features', href: '#' },
  { name: 'Solution', href: '#' },
  { name: 'Pricing', href: '#' },
  { name: 'About', href: '#' },
];

export default function HeroSection() {
  const [menuState, setMenuState] = useState(false);
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
    <>
      <header>
        <nav
          data-state={menuState && 'active'}
          className="fixed z-20 w-full border-b border-dashed bg-white backdrop-blur md:relative dark:bg-zinc-950/50 lg:dark:bg-transparent"
        >
          <div className="m-auto max-w-5xl px-6">
            <div className="flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
              <div className="flex w-full justify-between lg:w-auto">
                <Link href="/" aria-label="home" className="flex items-center space-x-2">
                  <Logo />
                </Link>

                <div className="flex items-center gap-4">
                  <div className="lg:hidden">
                    <ThemeToggle />
                  </div>
                  <button
                    onClick={() => setMenuState(!menuState)}
                    aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                    className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
                  >
                    <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                    <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                  </button>
                </div>
              </div>

              <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                <div className="lg:pr-4">
                  <ul className="space-y-6 text-base lg:flex lg:gap-8 lg:space-y-0 lg:text-sm">
                    {menuItems.map((item, index) => (
                      <li key={index}>
                        <Link
                          href={item.href}
                          className="text-muted-foreground hover:text-accent-foreground block duration-150"
                        >
                          <span>{item.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit lg:border-l lg:pl-6">
                  <div className="hidden lg:block">
                    <ThemeToggle />
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href="#">
                      <span>Login</span>
                    </Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href="#">
                      <span>Sign Up</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <main>
        <div
          aria-hidden
          className="z-2 absolute inset-0 isolate hidden opacity-50 contain-strict lg:block"
        >
          <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
          <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
          <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
        </div>

        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-muted/50 dark:bg-background">
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

          <div className="mx-auto 2xl:max-w-7xl">
            <div className="perspective-distant pl-8 lg:pl-44">
              <div className="lg:h-176 rotate-x-20 mask-b-from-55% mask-b-to-100% mask-r-from-75% skew-x-12 pl-6 pt-6">
                <Image
                  className="rounded-(--radius) border shadow-xl dark:hidden"
                  src="/card.webp"
                  alt="Tailark hero section"
                  width={2880}
                  height={2074}
                />
                <Image
                  className="rounded-(--radius) hidden border shadow-xl dark:block"
                  src="/dark-card.webp"
                  alt="Tailark hero section"
                  width={2880}
                  height={2074}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
