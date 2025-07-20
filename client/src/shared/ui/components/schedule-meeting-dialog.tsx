import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AnimatedButton } from "@/components/ui/animated-button";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { DatePicker } from "@/components/ui/date-picker";
import { FilePlus, FileText, Paperclip, Upload, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { queryClient } from "@/lib/queryClient";

const meetingFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  employeeId: z.string().min(1, "Please select a participant"),
  date: z.date({
    required_error: "Meeting date is required",
  }),
  duration: z.string().min(1, "Please select a duration"),
  location: z.string().optional(),
  agenda: z.string().optional(),
  // We'll handle file validation separately
});

type MeetingFormValues = z.infer<typeof meetingFormSchema>;

// Allowed file types for agenda attachments
const ACCEPTED_FILE_TYPES = [
  "application/pdf", 
  "application/msword", 
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain"
];

export function ScheduleMeetingDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [fileUploading, setFileUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<MeetingFormValues>({
    resolver: zodResolver(meetingFormSchema),
    defaultValues: {
      title: "",
      employeeId: "",
      location: "Virtual",
      agenda: "",
      duration: "30",
    },
  });

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    
    if (selectedFile) {
      if (!ACCEPTED_FILE_TYPES.includes(selectedFile.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF, Word document, or text file",
          variant: "destructive",
        });
        return;
      }
      
      if (selectedFile.size > 10 * 1024 * 1024) { // 10MB max
        toast({
          title: "File too large",
          description: "Maximum file size is 10MB",
          variant: "destructive",
        });
        return;
      }
      
      setFile(selectedFile);
    }
  };

  // Simulate file upload with progress
  const uploadFile = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      setFileUploading(true);
      setUploadProgress(0);
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + 10;
          if (newProgress >= 100) {
            clearInterval(interval);
            setFileUploading(false);
            // In a real app, the server would return a file URL/ID
            resolve(`file-${Date.now()}`);
            return 100;
          }
          return newProgress;
        });
      }, 300);
    });
  };

  // Remove attached file
  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle form submission
  async function onSubmit(data: MeetingFormValues) {
    try {
      let fileId = null;
      
      // Upload file if attached
      if (file) {
        fileId = await uploadFile(file);
      }
      
      // Format the data for the API
      const meetingData = {
        title: data.title,
        employeeId: parseInt(data.employeeId),
        managerId: 1, // Current user (logged in user) as the manager
        scheduledAt: data.date.toISOString(),
        duration: parseInt(data.duration),
        status: "scheduled",
        location: data.location || "Virtual",
        agendaItems: data.agenda ? JSON.stringify([data.agenda]) : null,
        notes: file ? `Document attached: ${file.name}` : null,
      };

      // Submit to API
      await apiRequest('POST', '/api/one-on-ones', meetingData);
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/one-on-ones'] });
      
      toast({
        title: "1:1 meeting scheduled",
        description: "Your one-on-one meeting has been scheduled successfully",
      });
      
      setOpen(false);
      form.reset();
      setFile(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule meeting. Please try again.",
        variant: "destructive",
      });
      console.error("Error scheduling meeting:", error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <AnimatedButton
          variant="outline"
          size="sm"
          className="flex items-center gap-1.5"
        >
          <i className="ri-calendar-line"></i>
          <span>Schedule 1:1</span>
        </AnimatedButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Schedule 1:1 Meeting</DialogTitle>
          <DialogDescription>
            Set up a one-on-one meeting with a team member
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meeting Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Weekly Check-in" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Participant</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select team member" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">Sarah Johnson</SelectItem>
                      <SelectItem value="2">Michael Chen</SelectItem>
                      <SelectItem value="3">David Miller</SelectItem>
                      <SelectItem value="4">Emily Wilson</SelectItem>
                      <SelectItem value="5">James Taylor</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Meeting Date & Time</FormLabel>
                    <DatePicker
                      date={field.value}
                      setDate={field.onChange}
                      className="w-full"
                      showTimePicker={true}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || "Virtual"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select meeting location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Virtual">Virtual</SelectItem>
                      <SelectItem value="Google Meet">Google Meet</SelectItem>
                      <SelectItem value="Zoom">Zoom</SelectItem>
                      <SelectItem value="Microsoft Teams">Microsoft Teams</SelectItem>
                      <SelectItem value="Conference Room">Conference Room</SelectItem>
                      <SelectItem value="Office">Office</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="agenda"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agenda</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Discuss current projects, blockers, and goals"
                      className="resize-none min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Add agenda items to help your team member prepare for the meeting.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* File Upload Section */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <FormLabel>Attachment</FormLabel>
                <FormDescription className="mt-0">
                  Upload a document or PDF file (max 10MB)
                </FormDescription>
              </div>
              
              {!file ? (
                <div 
                  className="flex flex-col items-center justify-center border-2 border-dashed p-6 rounded-lg bg-gray-50 dark:bg-gray-900 cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.currentTarget.classList.add('border-primary');
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.currentTarget.classList.remove('border-primary');
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.currentTarget.classList.remove('border-primary');
                    
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                      const droppedFile = e.dataTransfer.files[0];
                      
                      // Check if file type is valid
                      if (!ACCEPTED_FILE_TYPES.includes(droppedFile.type)) {
                        toast({
                          title: "Invalid file type",
                          description: "Please upload a PDF, Word document, or text file",
                          variant: "destructive",
                        });
                        return;
                      }
                      
                      // Check file size
                      if (droppedFile.size > 10 * 1024 * 1024) {
                        toast({
                          title: "File too large",
                          description: "Maximum file size is 10MB",
                          variant: "destructive",
                        });
                        return;
                      }
                      
                      setFile(droppedFile);
                    }
                  }}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.txt"
                    className="hidden"
                  />
                  
                  <div className="flex flex-col items-center text-center mb-4">
                    <FilePlus className="h-10 w-10 text-gray-400 mb-2" />
                    <div className="text-sm font-medium mb-1">Drag and drop a file here or click to browse</div>
                    <div className="text-xs text-muted-foreground">PDF, Word, or text documents only</div>
                  </div>
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1.5"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Choose File</span>
                  </Button>
                </div>
              ) : (
                <div className="border rounded-lg p-4 relative">
                  {fileUploading ? (
                    <>
                      <div className="flex items-center space-x-3 mb-3">
                        <FileText className="h-8 w-8 text-primary" />
                        <div className="flex-1">
                          <div className="text-sm font-medium truncate mb-1">{file.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </div>
                        </div>
                      </div>
                      <Progress value={uploadProgress} className="h-2 mb-1" />
                      <div className="text-xs text-right text-muted-foreground">
                        Uploading: {uploadProgress}%
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center">
                      <div className="flex items-center space-x-3 flex-1">
                        <FileText className="h-8 w-8 text-primary" />
                        <div>
                          <div className="text-sm font-medium truncate">{file.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                        Ready to upload
                      </Badge>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeFile}
                        className="ml-2"
                      >
                        <X className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={fileUploading}>
                {fileUploading ? "Uploading..." : "Schedule Meeting"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}