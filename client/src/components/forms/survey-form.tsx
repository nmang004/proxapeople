import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, PlusIcon, TrashIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiRequest, queryClient } from "@/lib/queryClient";

// Define the question types
const questionTypes = [
  { id: "multiple_choice", name: "Multiple Choice" },
  { id: "rating", name: "Rating Scale" },
  { id: "text", name: "Text Response" },
  { id: "likert", name: "Likert Scale" }
];

// Create a form schema
const surveyFormSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  description: z.string().optional(),
  templateId: z.string().optional(),
  startDate: z.date(),
  endDate: z.date(),
  isAnonymous: z.boolean().default(true),
  questions: z.array(
    z.object({
      id: z.string(),
      text: z.string().min(1, { message: "Question text is required" }),
      type: z.string(),
      options: z.array(z.string()).optional(),
      required: z.boolean().default(true)
    })
  ).min(1, { message: "At least one question is required" })
});

type SurveyFormValues = z.infer<typeof surveyFormSchema>;

interface SurveyFormProps {
  open: boolean;
  onClose: () => void;
  initialData?: any;
  templates?: { id: string; name: string }[];
}

export default function SurveyForm({ open, onClose, initialData, templates = [] }: SurveyFormProps) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("details");
  
  // Create form with react-hook-form
  const form = useForm<SurveyFormValues>({
    resolver: zodResolver(surveyFormSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 14)), // Default to 2 weeks
      isAnonymous: true,
      questions: [
        {
          id: `q-${Date.now()}`, // Generate a unique ID
          text: "",
          type: "multiple_choice",
          options: ["", ""],
          required: true
        }
      ]
    }
  });

  // Add a new question
  const addQuestion = () => {
    const currentQuestions = form.getValues("questions") || [];
    form.setValue("questions", [
      ...currentQuestions,
      {
        id: `q-${Date.now()}`,
        text: "",
        type: "multiple_choice",
        options: ["", ""],
        required: true
      }
    ]);
  };

  // Remove a question
  const removeQuestion = (index: number) => {
    const currentQuestions = form.getValues("questions") || [];
    if (currentQuestions.length > 1) {
      form.setValue("questions", currentQuestions.filter((_, i) => i !== index));
    }
  };

  // Add an option to a multiple choice question
  const addOption = (questionIndex: number) => {
    const questions = form.getValues("questions");
    const question = questions[questionIndex];
    const options = question.options || [];
    
    form.setValue(`questions.${questionIndex}.options`, [...options, ""]);
  };

  // Remove an option from a multiple choice question
  const removeOption = (questionIndex: number, optionIndex: number) => {
    const questions = form.getValues("questions");
    const question = questions[questionIndex];
    const options = question.options || [];
    
    if (options.length > 2) { // Maintain at least 2 options
      form.setValue(
        `questions.${questionIndex}.options`,
        options.filter((_, i) => i !== optionIndex)
      );
    }
  };

  // Handle survey submission
  const onSubmit = async (data: SurveyFormValues) => {
    try {
      // Create the survey
      if (initialData) {
        // Update existing survey
        await apiRequest(`/api/surveys/${initialData.id}`, "PATCH", data);
      } else {
        // Create new survey
        await apiRequest("/api/surveys", "POST", data);
      }

      // Invalidate the surveys query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['/api/surveys'] });
      
      // Close the dialog
      onClose();
    } catch (error) {
      console.error("Error saving survey:", error);
    }
  };

  const getQuestionTypeLabel = (typeId: string) => {
    const type = questionTypes.find(t => t.id === typeId);
    return type ? type.name : "Unknown";
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{initialData ? "Edit Survey" : "Create New Survey"}</DialogTitle>
          <DialogDescription>
            Create a survey to collect feedback from employees
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="details">Survey Details</TabsTrigger>
                <TabsTrigger value="questions">Questions</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              {/* Survey Details Tab */}
              <TabsContent value="details" className="mt-0">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Survey Name</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g., Employee Engagement Pulse Q4 2023" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe the purpose of this survey" 
                            className="min-h-[80px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {templates.length > 0 && (
                    <FormField
                      control={form.control}
                      name="templateId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Use Template (Optional)</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a template" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {templates.map((template) => (
                                <SelectItem key={template.id} value={template.id}>
                                  {template.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Start Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date(new Date().setHours(0, 0, 0, 0))
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>End Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => {
                                  const startDate = form.getValues("startDate");
                                  return startDate && date < startDate;
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Questions Tab */}
              <TabsContent value="questions" className="mt-0">
                <div className="space-y-6">
                  {form.watch("questions")?.map((question, questionIndex) => (
                    <Card key={question.id} className="border">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <CardTitle className="text-base">Question {questionIndex + 1}</CardTitle>
                            <CardDescription>
                              {getQuestionTypeLabel(question.type)}
                            </CardDescription>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeQuestion(questionIndex)}
                            disabled={form.watch("questions").length <= 1}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-3 space-y-4">
                        <FormField
                          control={form.control}
                          name={`questions.${questionIndex}.text`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Question Text</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your question" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`questions.${questionIndex}.type`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Question Type</FormLabel>
                              <Select
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  if (value === "multiple_choice" && !question.options) {
                                    form.setValue(`questions.${questionIndex}.options`, ["", ""]);
                                  }
                                }}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select question type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {questionTypes.map((type) => (
                                    <SelectItem key={type.id} value={type.id}>
                                      {type.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Multiple choice options */}
                        {question.type === "multiple_choice" && (
                          <div className="space-y-2">
                            <FormLabel>Answer Options</FormLabel>
                            {question.options?.map((option, optionIndex) => (
                              <div key={optionIndex} className="flex gap-2">
                                <Input
                                  placeholder={`Option ${optionIndex + 1}`}
                                  value={option}
                                  onChange={(e) => {
                                    const newOptions = [...question.options || []];
                                    newOptions[optionIndex] = e.target.value;
                                    form.setValue(`questions.${questionIndex}.options`, newOptions);
                                  }}
                                  className="flex-1"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeOption(questionIndex, optionIndex)}
                                  disabled={(question.options?.length || 0) <= 2}
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addOption(questionIndex)}
                              className="mt-2"
                            >
                              <PlusIcon className="h-4 w-4 mr-2" />
                              Add Option
                            </Button>
                          </div>
                        )}

                        <div className="flex items-center space-x-2 pt-2">
                          <FormField
                            control={form.control}
                            name={`questions.${questionIndex}.required`}
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-2">
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <Label>Required</Label>
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <Button type="button" variant="outline" onClick={addQuestion} className="w-full">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Question
                  </Button>
                </div>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="mt-0">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="isAnonymous"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Anonymous Responses</FormLabel>
                          <div className="text-sm text-gray-500">
                            Keep survey responses anonymous to encourage honest feedback
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {initialData ? "Update Survey" : "Create Survey"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}