import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AnimatedButton } from "@/components/ui/animated-button";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { DatePicker } from "@/components/ui/date-picker";
import { X, Plus, GripVertical } from "lucide-react";

const surveyFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(3, "Description must be at least 3 characters"),
  templateId: z.string().optional(),
  teamId: z.string().min(1, "Please select a team"),
  anonymous: z.boolean().default(false),
  dueDate: z.date({
    required_error: "Due date is required",
  }),
  questions: z.array(
    z.object({
      text: z.string().min(3, "Question text is required"),
      type: z.enum(["rating", "text", "multiple_choice", "yes_no"]),
      required: z.boolean().default(true),
    })
  ).min(1, "At least one question is required"),
});

type SurveyFormValues = z.infer<typeof surveyFormSchema>;

type QuestionType = {
  text: string;
  type: "rating" | "text" | "multiple_choice" | "yes_no";
  required: boolean;
};

export function NewSurveyDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [questions, setQuestions] = useState<QuestionType[]>([
    { text: "", type: "rating", required: true }
  ]);

  const form = useForm<SurveyFormValues>({
    resolver: zodResolver(surveyFormSchema),
    defaultValues: {
      title: "",
      description: "",
      anonymous: false,
      questions: [{ text: "", type: "rating" as const, required: true }],
    },
  });

  const addQuestion = () => {
    const newQuestions = [...questions, { text: "", type: "rating" as const, required: true }];
    setQuestions(newQuestions);
    form.setValue("questions", newQuestions);
  };

  const removeQuestion = (index: number) => {
    if (questions.length === 1) {
      toast({
        title: "Cannot remove",
        description: "You need at least one question",
        variant: "destructive",
      });
      return;
    }
    
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
    form.setValue("questions", newQuestions);
  };

  const updateQuestion = (index: number, field: keyof QuestionType, value: any) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuestions(newQuestions);
    form.setValue("questions", newQuestions);
  };

  function onSubmit(data: SurveyFormValues) {
    // Format the data for the API
    const surveyData = {
      ...data,
      dueDate: data.dueDate.toISOString().split('T')[0],
      status: "active",
      createdById: 1  // Current user ID
    };

    // Submit to API
    apiRequest("POST", "/api/surveys", surveyData)
      .then(() => {
        toast({
          title: "Survey created",
          description: "Your survey has been created and sent to team members",
        });
        setOpen(false);
        form.reset();
        setQuestions([{ text: "", type: "rating", required: true }]);
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: "Failed to create survey. Please try again.",
          variant: "destructive",
        });
        console.error("Error creating survey:", error);
      });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <AnimatedButton
          variant="outline"
          size="sm"
          className="flex items-center gap-1.5"
        >
          <i className="ri-survey-line"></i>
          <span>New Survey</span>
        </AnimatedButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Create New Survey</DialogTitle>
          <DialogDescription>
            Create a survey to collect feedback from your team members
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Survey Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Employee Satisfaction Survey" {...field} />
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
                      placeholder="Help us understand how we can improve your work experience"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="teamId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Team</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select team" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">Engineering</SelectItem>
                        <SelectItem value="2">Design</SelectItem>
                        <SelectItem value="3">Product</SelectItem>
                        <SelectItem value="4">Marketing</SelectItem>
                        <SelectItem value="5">All Teams</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                        <SelectItem value="1">Employee Satisfaction</SelectItem>
                        <SelectItem value="2">Team Engagement</SelectItem>
                        <SelectItem value="3">Manager Feedback</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date</FormLabel>
                    <DatePicker
                      date={field.value}
                      setDate={field.onChange}
                      className="w-full"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="anonymous"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-md border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Anonymous Responses</FormLabel>
                      <FormDescription>
                        Hide respondent identity in results
                      </FormDescription>
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

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Survey Questions</h3>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={addQuestion}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Question</span>
                </Button>
              </div>

              <div className="space-y-3">
                {questions.map((question, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-md bg-muted/20">
                    <div className="flex-shrink-0 mt-1 text-muted-foreground">
                      <GripVertical className="h-5 w-5" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex">
                        <Input
                          placeholder="Enter your question"
                          value={question.text}
                          onChange={(e) => updateQuestion(index, 'text', e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeQuestion(index)}
                          className="ml-2"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Select
                          value={question.type}
                          onValueChange={(value) => updateQuestion(index, 'type', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Question type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="rating">Rating Scale</SelectItem>
                            <SelectItem value="text">Text Response</SelectItem>
                            <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                            <SelectItem value="yes_no">Yes/No</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={question.required}
                            onCheckedChange={(checked) => updateQuestion(index, 'required', checked)}
                            id={`required-${index}`}
                          />
                          <label
                            htmlFor={`required-${index}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Required
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button type="submit">Create Survey</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}