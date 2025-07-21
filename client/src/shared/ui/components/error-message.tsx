import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ErrorMessageProps {
  message?: string;
  title?: string;
  className?: string;
}

export function ErrorMessage({ 
  message = "Something went wrong. Please try again later.", 
  title,
  className 
}: ErrorMessageProps) {
  return (
    <Alert variant="destructive" className={className}>
      <AlertCircle className="h-4 w-4" />
      {title && <AlertDescription className="font-medium mb-1">{title}</AlertDescription>}
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}