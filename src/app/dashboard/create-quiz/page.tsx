"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Card, GradientButton } from "@/app/components/ui-components"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Clock, Loader2, Plus, Trash } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function CreateQuizPage() {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: "",
      options: [
        { id: 1, text: "", isCorrect: false },
        { id: 2, text: "", isCorrect: false },
        { id: 3, text: "", isCorrect: false },
        { id: 4, text: "", isCorrect: false },
      ],
    },
  ])

  const [isSubmitting, setIsSubmitting] = useState(false)

  const addQuestion = () => {
    const newId = questions.length + 1
    setQuestions([
      ...questions,
      {
        id: newId,
        question: "",
        options: [
          { id: 1, text: "", isCorrect: false },
          { id: 2, text: "", isCorrect: false },
          { id: 3, text: "", isCorrect: false },
          { id: 4, text: "", isCorrect: false },
        ],
      },
    ])
  }

  const removeQuestion = (id: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== id))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      // Redirect or show success message
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Create Quiz</h1>
        <p className="text-muted-foreground">Create a new quiz by filling out the form below.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-medium">Quiz Details</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Quiz Title</Label>
              <Input id="title" placeholder="Enter quiz title" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select>
                <SelectTrigger id="subject">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="math">Mathematics</SelectItem>
                  <SelectItem value="science">Science</SelectItem>
                  <SelectItem value="history">History</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="programming">Programming</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="start-date" type="date" className="pl-10" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="start-time">Start Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="start-time" type="time" className="pl-10" />
              </div>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Enter quiz description" rows={3} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input id="duration" type="number" min="1" placeholder="30" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="passing-score">Passing Score (%)</Label>
              <Input id="passing-score" type="number" min="1" max="100" placeholder="60" />
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Questions</h2>
            <Button type="button" onClick={addQuestion} variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Question
            </Button>
          </div>

          {questions.map((question, qIndex) => (
            <Card key={question.id} className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-medium">Question {qIndex + 1}</h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeQuestion(question.id)}
                  disabled={questions.length === 1}
                >
                  <Trash className="h-4 w-4" />
                  <span className="sr-only">Remove question</span>
                </Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`question-${question.id}`}>Question</Label>
                  <Textarea id={`question-${question.id}`} placeholder="Enter your question" required />
                </div>

                <div className="space-y-2">
                  <Label>Options</Label>
                  <RadioGroup defaultValue="option-1">
                    {question.options.map((option) => (
                      <div key={option.id} className="flex items-start space-x-2">
                        <RadioGroupItem value={`option-${option.id}`} id={`q${question.id}-option-${option.id}`} />
                        <div className="flex-1 space-y-1">
                          <Label htmlFor={`q${question.id}-option-${option.id}`} className="text-sm font-normal">
                            Correct Answer
                          </Label>
                          <Input placeholder={`Option ${option.id}`} required />
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" asChild>
            <Link href="/dashboard">Cancel</Link>
          </Button>
          <GradientButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Quiz...
              </>
            ) : (
              "Create Quiz"
            )}
          </GradientButton>
        </div>
      </form>
    </div>
  )
}
