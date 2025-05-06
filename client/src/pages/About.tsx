"use client";

import { motion } from "framer-motion";
import {
  Check,
  Server,
  Globe,
  Cloud,
  Headphones,
  MessageSquare,
  Database,
  Brain,
  Code,
  Users,
  Languages,
  Megaphone,
  CloudCog,
  Github,
  ExternalLink,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AboutPage() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const techStack = [
    {
      title: "Frontend",
      description: "React hosted on AWS S3",
      icon: <Code className="h-10 w-10 text-orange-500" />,
    },
    {
      title: "Backend API",
      description: "Node.js (Express)",
      icon: <Server className="h-10 w-10 text-green-500" />,
    },
    {
      title: "LLM API",
      description: "OpenAI API / AWS Bedrock",
      icon: <Brain className="h-10 w-10 text-purple-500" />,
    },
    {
      title: "Cloud Infra",
      description: "AWS S3, API Gateway, Lambda, DynamoDB",
      icon: <Cloud className="h-10 w-10 text-blue-500" />,
    },
    {
      title: "Voice (Optional)",
      description: "OpenAI Whisper / Amazon Transcribe & Polly",
      icon: <Headphones className="h-10 w-10 text-pink-500" />,
    },
  ];

  const features = [
    {
      title: "Chatbot UI",
      description: "Intuitive interface for asking finance-related queries",
      icon: <MessageSquare className="h-6 w-6 text-teal-500" />,
    },
    {
      title: "Smart Backend",
      description:
        "Sends user queries to LLMs and provides simplified financial advice",
      icon: <Brain className="h-6 w-6 text-purple-500" />,
    },
    {
      title: "Data Storage",
      description: "Stores chat history per session/user in DynamoDB",
      icon: <Database className="h-6 w-6 text-blue-500" />,
    },
    {
      title: "Multilingual",
      description: "Support for Hindi, Bengali, and other Indian languages",
      icon: <Languages className="h-6 w-6 text-orange-500" />,
    },
    {
      title: "Voice Support",
      description: "Optional voice input/output for better accessibility",
      icon: <Megaphone className="h-6 w-6 text-pink-500" />,
    },
    {
      title: "Cloud Native",
      description: "Built using AWS services for scalability and reliability",
      icon: <CloudCog className="h-6 w-6 text-blue-500" />,
    },
  ];

  const useCases = [
    "How much should I save monthly if I earn ₹30,000?",
    "What is SIP?",
    "What's better — fixed deposit or gold?",
    "How can I reduce my EMI burden?",
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Hero Section */}
      <motion.section
        className="relative overflow-hidden bg-gradient-to-b from-teal-50 to-zinc-50 dark:from-teal-950/30 dark:to-zinc-950 py-20 md:py-32"
        initial="initial"
        animate="animate"
        variants={stagger}
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <div className="flex flex-col items-center text-center space-y-4">
            <motion.div variants={fadeIn}>
              <Badge className="bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 border-none px-3 py-1 text-sm">
                About ArthaAI
              </Badge>
            </motion.div>
            <motion.h1
              className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400"
              variants={fadeIn}
            >
              DEMOCRATIZING FINANCIAL WISDOM
            </motion.h1>
            <motion.p
              className="max-w-[700px] text-zinc-600 dark:text-zinc-400 md:text-xl"
              variants={fadeIn}
            >
              Making personal finance accessible to every Indian through
              AI-powered conversations
            </motion.p>
          </div>
        </div>
      </motion.section>

      {/* Problem & Solution Section */}
      <motion.section
        className="py-16 md:py-24 bg-white dark:bg-zinc-900"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={stagger}
      >
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div variants={fadeIn} className="space-y-6">
              <Badge className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-none px-3 py-1 text-sm">
                The Problem
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter text-zinc-900 dark:text-zinc-50">
                Financial Literacy Gap in India
              </h2>
              <div className="space-y-4 text-zinc-600 dark:text-zinc-300">
                <p>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                    70%+ of India's working population is financially
                    under-informed.
                  </span>{" "}
                  Most don't understand how to budget, save, or invest —
                  especially in Tier 2/3 towns and low-income groups.
                </p>
                <p>
                  Financial apps today assume literacy, access, or prior
                  knowledge — leaving millions out of the financial inclusion
                  journey.
                </p>
                <div className="pt-4">
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
                    Key Challenges:
                  </h3>
                  <ul className="space-y-2">
                    {[
                      "Complex financial jargon intimidates beginners",
                      "Lack of personalized guidance for different income levels",
                      "Language barriers for non-English speakers",
                      "Limited access to financial advisors",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1 flex-shrink-0 h-5 w-5 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                          <Check className="h-3 w-3 text-red-600 dark:text-red-400" />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeIn} className="space-y-6">
              <Badge className="bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 border-none px-3 py-1 text-sm">
                The Solution
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter text-zinc-900 dark:text-zinc-50">
                Introducing ArthaAI
              </h2>
              <div className="space-y-4 text-zinc-600 dark:text-zinc-300">
                <p>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                    ArthaAI
                  </span>{" "}
                  is an AI-powered financial chatbot designed to bridge the
                  financial literacy gap in India through conversational
                  guidance.
                </p>
                <p>
                  Our platform simplifies complex financial concepts, provides
                  personalized advice, and speaks in vernacular languages to
                  make financial wisdom accessible to everyone.
                </p>
                <div className="pt-4">
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
                    Key Solutions:
                  </h3>
                  <ul className="space-y-2">
                    {[
                      "Simplifies complex financial concepts (SIP, EMI, credit scores)",
                      "Guides users to make better money decisions",
                      "Speaks in vernacular language (e.g., Hindi)",
                      "Delivers experience via web or mobile using AWS cloud",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1 flex-shrink-0 h-5 w-5 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center">
                          <Check className="h-3 w-3 text-teal-600 dark:text-teal-400" />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Tech Stack Section */}
      <motion.section
        className="py-16 md:py-24 bg-zinc-50 dark:bg-zinc-900/50"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={stagger}
      >
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div className="text-center mb-12" variants={fadeIn}>
            <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-none px-3 py-1 text-sm mb-4">
              Technology
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter text-zinc-900 dark:text-zinc-50 mb-4">
              Our Tech Stack
            </h2>
            <p className="max-w-[700px] mx-auto text-zinc-600 dark:text-zinc-300">
              ArthaAI is built using modern, cloud-native technologies that
              ensure scalability, reliability, and performance.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={{
              initial: { opacity: 0 },
              animate: { opacity: 1 },
            }}
          >
            {techStack.map((tech, i) => (
              <motion.div
                key={tech.title}
                variants={{
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0, transition: { delay: i * 0.1 } },
                }}
              >
                <Card className="h-full border-none shadow-md hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-zinc-800">
                  <CardHeader className="pb-2">
                    <div className="mb-2">{tech.icon}</div>
                    <CardTitle className="text-xl">{tech.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-zinc-600 dark:text-zinc-300">
                      {tech.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="py-16 md:py-24 bg-white dark:bg-zinc-900"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={stagger}
      >
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div className="text-center mb-12" variants={fadeIn}>
            <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-none px-3 py-1 text-sm mb-4">
              Features
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter text-zinc-900 dark:text-zinc-50 mb-4">
              What Makes ArthaAI Special
            </h2>
            <p className="max-w-[700px] mx-auto text-zinc-600 dark:text-zinc-300">
              Our platform combines cutting-edge AI with thoughtful design to
              create a unique financial assistant.
            </p>
          </motion.div>

          <Tabs defaultValue="core" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList>
                <TabsTrigger value="core">Core Features</TabsTrigger>
                <TabsTrigger value="bonus">Bonus Features</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="core" className="mt-0">
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={{
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                }}
                initial="initial"
                animate="animate"
              >
                {features.slice(0, 3).map((feature, i) => (
                  <motion.div
                    key={feature.title}
                    variants={{
                      initial: { opacity: 0, y: 20 },
                      animate: {
                        opacity: 1,
                        y: 0,
                        transition: { delay: i * 0.1 },
                      },
                    }}
                  >
                    <Card className="h-full border-none shadow-md hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-zinc-800">
                      <CardHeader className="pb-2">
                        <div className="mb-2">{feature.icon}</div>
                        <CardTitle>{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-zinc-600 dark:text-zinc-300">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="bonus" className="mt-0">
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={{
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                }}
                initial="initial"
                animate="animate"
              >
                {features.slice(3).map((feature, i) => (
                  <motion.div
                    key={feature.title}
                    variants={{
                      initial: { opacity: 0, y: 20 },
                      animate: {
                        opacity: 1,
                        y: 0,
                        transition: { delay: i * 0.1 },
                      },
                    }}
                  >
                    <Card className="h-full border-none shadow-md hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-zinc-800">
                      <CardHeader className="pb-2">
                        <div className="mb-2">{feature.icon}</div>
                        <CardTitle>{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-zinc-600 dark:text-zinc-300">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </motion.section>

      {/* Use Cases Section */}
      <motion.section
        className="py-16 md:py-24 bg-gradient-to-b from-teal-50 to-zinc-50 dark:from-teal-950/30 dark:to-zinc-950"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={stagger}
      >
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div className="text-center mb-12" variants={fadeIn}>
            <Badge className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-none px-3 py-1 text-sm mb-4">
              Use Cases
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter text-zinc-900 dark:text-zinc-50 mb-4">
              How People Use ArthaAI
            </h2>
            <p className="max-w-[700px] mx-auto text-zinc-600 dark:text-zinc-300">
              Our AI assistant helps users with a wide range of financial
              questions and concerns.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
            variants={{
              initial: { opacity: 0 },
              animate: { opacity: 1 },
            }}
          >
            {useCases.map((useCase, i) => (
              <motion.div
                key={i}
                variants={{
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0, transition: { delay: i * 0.1 } },
                }}
                className="group"
              >
                <Card className="h-full border-none shadow-md group-hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-zinc-800 overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-teal-500 to-emerald-500 m-0"></div>
                  <CardContent>
                    <div className="flex items-start gap-4">
                      <div className="mt-1 flex-shrink-0 h-8 w-8 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center">
                        <MessageSquare className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                      </div>
                      <p className="text-zinc-700 dark:text-zinc-200 font-medium">
                        "{useCase}"
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Uniqueness Section */}
      <motion.section
        className="py-16 md:py-24 bg-white dark:bg-zinc-900"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={stagger}
      >
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div className="text-center mb-12" variants={fadeIn}>
            <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border-none px-3 py-1 text-sm mb-4">
              What Makes Us Unique
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter text-zinc-900 dark:text-zinc-50 mb-4">
              Our Competitive Edge
            </h2>
            <p className="max-w-[700px] mx-auto text-zinc-600 dark:text-zinc-300">
              ArthaAI stands out from other financial tools in several key ways.
            </p>
          </motion.div>

          <div className="overflow-x-auto">
            <motion.table className="w-full border-collapse" variants={fadeIn}>
              <thead>
                <tr>
                  <th className="text-left p-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 rounded-tl-lg">
                    Feature
                  </th>
                  <th className="text-left p-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 rounded-tr-lg">
                    Uniqueness
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    feature: "Localized Financial Advice",
                    uniqueness:
                      "Designed for India's real-world income patterns and concerns",
                  },
                  {
                    feature: "AI-powered Simplification",
                    uniqueness: "Uses LLMs to explain finance without jargon",
                  },
                  {
                    feature: "Vernacular Support",
                    uniqueness: "Multilingual responses (Hindi, Bengali, etc.)",
                  },
                  {
                    feature: "Voice-Enabled (Optional)",
                    uniqueness:
                      "Uses Whisper or AWS voice tools for accessibility",
                  },
                  {
                    feature: "Cloud Native Stack",
                    uniqueness:
                      "Built using AWS S3, Lambda, DynamoDB – low cost, scalable",
                  },
                  {
                    feature: "Solo-Built and Fully Open Source",
                    uniqueness:
                      "Lightweight and replicable for grassroots deployment",
                  },
                ].map((row, i) => (
                  <motion.tr
                    key={i}
                    variants={{
                      initial: { opacity: 0 },
                      animate: { opacity: 1, transition: { delay: i * 0.1 } },
                    }}
                    className={
                      i % 2 === 0
                        ? "bg-white dark:bg-zinc-900"
                        : "bg-zinc-50 dark:bg-zinc-800/50"
                    }
                  >
                    <td className="p-4 border-b border-zinc-200 dark:border-zinc-700 font-medium text-zinc-900 dark:text-zinc-50">
                      {row.feature}
                    </td>
                    <td className="p-4 border-b border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300">
                      {row.uniqueness}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </motion.table>
          </div>
        </div>
      </motion.section>

      {/* Vision Section */}
      <motion.section
        className="py-16 md:py-24 bg-gradient-to-b from-teal-900 to-emerald-900 dark:from-teal-950 dark:to-emerald-950 text-white"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={stagger}
      >
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div
            className="max-w-3xl mx-auto text-center space-y-6"
            variants={fadeIn}
          >
            <Badge className="bg-white/20 text-white border-none px-3 py-1 text-sm">
              Our Vision
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">
              Democratizing Financial Education
            </h2>
            <p className="text-xl md:text-2xl text-teal-100 leading-relaxed">
              "Democratize personal finance education in India using AI and
              cloud — so that even a tea vendor, a college student, or a retiree
              can make better money decisions."
            </p>
            <div className="pt-6 flex justify-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-teal-900 hover:bg-teal-100"
              >
                <a href="#">Try ArthaAI Today</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Deliverables Section */}
      <motion.section
        className="py-16 md:py-24 bg-zinc-50 dark:bg-zinc-950"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={stagger}
      >
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div className="text-center mb-12" variants={fadeIn}>
            <Badge className="bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-none px-3 py-1 text-sm mb-4">
              Project Deliverables
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter text-zinc-900 dark:text-zinc-50 mb-4">
              What We've Built
            </h2>
            <p className="max-w-[700px] mx-auto text-zinc-600 dark:text-zinc-300">
              ArthaAI is a complete solution with all the components needed for
              success.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={{
              initial: { opacity: 0 },
              animate: { opacity: 1 },
            }}
          >
            {[
              {
                title: "Deployed Demo",
                description: "Live demo hosted on AWS S3 + CloudFront",
                icon: (
                  <Globe className="h-10 w-10 text-zinc-700 dark:text-zinc-300" />
                ),
              },
              {
                title: "GitHub Repo",
                description: "Clean, documented codebase with README",
                icon: (
                  <Github className="h-10 w-10 text-zinc-700 dark:text-zinc-300" />
                ),
              },
              {
                title: "Video Demo",
                description: "Short 2-3 minute demo of key use cases",
                icon: (
                  <Headphones className="h-10 w-10 text-zinc-700 dark:text-zinc-300" />
                ),
              },
              {
                title: "Pitch Deck",
                description:
                  "Concise slides showing problem → solution → impact",
                icon: (
                  <Users className="h-10 w-10 text-zinc-700 dark:text-zinc-300" />
                ),
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                variants={{
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0, transition: { delay: i * 0.1 } },
                }}
              >
                <Card className="h-full border-none shadow-md hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-zinc-800 text-center">
                  <CardHeader className="pb-2 flex flex-col items-center">
                    <div className="mb-2">{item.icon}</div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-zinc-600 dark:text-zinc-300">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-16 md:py-24 bg-white dark:bg-zinc-900"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={stagger}
      >
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div
            className="max-w-3xl mx-auto text-center space-y-6 bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 p-8 md:p-12 rounded-2xl shadow-lg"
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold tracking-tighter text-zinc-900 dark:text-zinc-50">
              Join the Financial Literacy Revolution
            </h2>
            <p className="text-zinc-600 dark:text-zinc-300">
              Experience how ArthaAI is changing the way Indians understand and
              manage their finances.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white"
              >
                <a href="#">Try ArthaAI</a>
              </Button>
              <Button variant="outline" size="lg" className="gap-2">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  View on GitHub
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
