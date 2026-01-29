"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Mail, Github, Linkedin, Code2, Database, Terminal, User } from "lucide-react"

const teamMembers = [
  {
    name: "Dennis Trujillo",
    role: "Frontend Developer",
    initials: "DT",
    bio: "Responsable del desarrollo del Dashboard web, componentes visuales y consumo de la API para la presentación de métricas analíticas.",
    email: "datrujillov@uce.edu.ec",
    github: "Dennis290699",
    linkedin: "dennistrujillo",
    tags: ["Next.js", "React", "Tailwind", "Recharts"]
  },
  {
    name: "Freddy Tapia",
    role: "Backend Developer",
    initials: "FT",
    bio: "Encargado del desarrollo de la API REST, definición de endpoints y conexión con los resultados generados en HDFS.",
    email: "freddy.tapia@email.com",
    github: "freddytapia",
    linkedin: "freddytapia",
    tags: ["Node.js", "Express", "REST API", "WebHDFS"]
  },
  {
    name: "Santiago Maldonado",
    role: "Data Analyst",
    initials: "KP",
    bio: "Responsable del análisis de datos procesados y definición de métricas estadísticas para el Dashboard.",
    email: "kevin.pozo@email.com",
    github: "kevinpozo",
    linkedin: "kevinpozo",
    tags: ["Analytics", "Spark SQL", "Statistics"]
  },
  {
    name: "Bryan Loya",
    role: "Data Engineer",
    initials: "BL",
    bio: "Encargado del diseño del pipeline ETL, limpieza de datos y procesamiento distribuido con Apache Spark.",
    email: "bryan.loya@email.com",
    github: "bryanloya",
    linkedin: "bryanloya",
    tags: ["Spark", "Python", "ETL", "Parquet"]
  },
  {
    name: "Kevin Pozo",
    role: "Infrastructure & DevOps",
    initials: "SM",
    bio: "Responsable de la orquestación Docker, configuración del clúster Hadoop y soporte de infraestructura.",
    email: "santiago.maldonado@email.com",
    github: "santiagomaldonado",
    linkedin: "santiagomaldonado",
    tags: ["Docker", "Linux", "Hadoop", "Networking"]
  }
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
}

export default function TeamPage() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold tracking-tight">The Team</h1>
        <p className="text-muted-foreground max-w-2xl">
          The minds behind the NYC Taxi Analytics platform. Passionate about transforming complex data into clear insights.
        </p>
      </motion.div>

      {/* Team Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {teamMembers.map((member, index) => (
          <motion.div key={index} variants={item} whileHover={{ scale: 1.02 }} className="h-full">
            <Card className="relative overflow-hidden h-full border-border bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1 dark:hover:border-primary/40 dark:hover:shadow-primary/10">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="rounded-full bg-gradient-to-r from-primary via-accent to-chart-3 p-[3px]">
                      <Avatar className="h-16 w-16 border-2 border-background bg-background">
                        <AvatarImage src={`/placeholder.svg?height=64&width=64&query=${member.initials}`} />
                        <AvatarFallback className="bg-primary/10 text-xl font-bold text-primary">
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                      <Badge variant="secondary" className="font-normal">
                        {member.role}
                      </Badge>
                    </div>
                  </div>
                  <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    <User className="h-5 w-5" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed h-[60px]">
                  {member.bio}
                </p>

                <div className="flex flex-wrap gap-2">
                  {member.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs bg-muted/30">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-border">
                  <SocialLink href={`mailto:${member.email} `} icon={Mail} />
                  <SocialLink href={`https://github.com/${member.github}`} icon={Github} />
                  <SocialLink href={`https://linkedin.com/in/${member.linkedin}`} icon={Linkedin} />
                </div >
              </CardContent >
              {/* Decorative bottom bar matching StatCard */}
              < div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-primary via-accent to-chart-3" />
            </Card >
          </motion.div >
        ))}
      </motion.div >

      {/* About Section */}
      < motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="pt-8"
      >
        <h2 className="text-xl font-semibold tracking-tight mb-6">Technical Architecture</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <TechCard
            title="HDFS & Spark"
            desc="Distributed storage and real-time processing of millions of records."
            icon={Database}
            delay={0.5}
          />
          <TechCard
            title="Next.js API"
            desc="Optimized endpoints serving complex analytical data structures."
            icon={Terminal}
            delay={0.6}
          />
          <TechCard
            title="Modern UI"
            desc="Interactive visualizations using Recharts and shadcn/ui."
            icon={Code2}
            delay={0.7}
          />
        </div>
      </motion.div >
    </div >
  )
}

function SocialLink({ href, icon: Icon }: { href: string; icon: any }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="p-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
    >
      <Icon className="w-4 h-4" />
    </a>
  )
}

function TechCard({ title, desc, icon: Icon, delay }: { title: string, desc: string, icon: any, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      <Card className="h-full border-border bg-card transition-all duration-300 hover:shadow-lg dark:hover:border-primary/40">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <CardTitle className="text-base">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{desc}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}