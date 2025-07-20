// TODO: Add surveys endpoints when implemented

// Temporary Survey type to fix TypeScript errors
interface Survey {
  id: number;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Re-export surveys-specific hooks (note: need to add these to hooks.ts)
// export {
//   useSurveys,
//   useSurvey,
//   useCreateSurvey,
//   useUpdateSurvey,
//   useDeleteSurvey,
// } from '../../../shared/api/hooks';

// Re-export surveys-specific types
export type {
  Survey,
  SurveyTemplate,
  SurveyResponse,
  InsertSurvey,
  InsertSurveyTemplate,
  InsertSurveyResponse,
} from '../../../shared/api/types';

// Survey question types
export interface SurveyQuestion {
  id: string;
  type: 'text' | 'number' | 'rating' | 'multiple_choice' | 'checkbox' | 'textarea';
  question: string;
  required: boolean;
  options?: string[]; // For multiple choice and checkbox questions
  minValue?: number; // For number and rating questions
  maxValue?: number; // For number and rating questions
}

export interface SurveyAnswer {
  questionId: string;
  value: string | number | string[];
}

// Export a convenience object for surveys API
export const surveysApi = {
  // Helper functions specific to surveys feature
  getStatusLabel: (survey: Survey): string => {
    const now = new Date();
    const startDate = new Date(survey.startDate);
    const endDate = new Date(survey.endDate);
    
    if (now < startDate) return 'Upcoming';
    if (now > endDate) return 'Closed';
    return 'Active';
  },

  getStatusColor: (survey: Survey): string => {
    const status = surveysApi.getStatusLabel(survey);
    
    switch (status) {
      case 'Upcoming':
        return 'text-blue-600 bg-blue-100';
      case 'Active':
        return 'text-green-600 bg-green-100';
      case 'Closed':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  },

  isActive: (survey: Survey): boolean => {
    const now = new Date();
    const startDate = new Date(survey.startDate);
    const endDate = new Date(survey.endDate);
    
    return now >= startDate && now <= endDate;
  },

  getDaysRemaining: (survey: Survey): number => {
    const now = new Date();
    const endDate = new Date(survey.endDate);
    const diffTime = endDate.getTime() - now.getTime();
    
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },

  formatDateRange: (startDate: string, endDate: string): string => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const sameYear = start.getFullYear() === end.getFullYear();
    const sameMonth = sameYear && start.getMonth() === end.getMonth();
    
    if (sameMonth) {
      return `${start.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })} - ${end.toLocaleDateString('en-US', { 
        day: 'numeric', 
        year: 'numeric' 
      })}`;
    } else if (sameYear) {
      return `${start.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })} - ${end.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      })}`;
    } else {
      return `${start.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      })} - ${end.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      })}`;
    }
  },

  validateQuestion: (question: SurveyQuestion): string[] => {
    const errors: string[] = [];
    
    if (!question.question.trim()) {
      errors.push('Question text is required');
    }
    
    if (['multiple_choice', 'checkbox'].includes(question.type)) {
      if (!question.options || question.options.length < 2) {
        errors.push('Multiple choice and checkbox questions must have at least 2 options');
      }
    }
    
    if (['number', 'rating'].includes(question.type)) {
      if (question.minValue !== undefined && question.maxValue !== undefined) {
        if (question.minValue >= question.maxValue) {
          errors.push('Maximum value must be greater than minimum value');
        }
      }
    }
    
    return errors;
  },

  validateAnswer: (question: SurveyQuestion, answer: SurveyAnswer): string[] => {
    const errors: string[] = [];
    
    if (question.required && (answer.value === undefined || answer.value === null || answer.value === '')) {
      errors.push('This question is required');
      return errors;
    }
    
    switch (question.type) {
      case 'number':
      case 'rating':
        const numValue = Number(answer.value);
        if (isNaN(numValue)) {
          errors.push('Answer must be a valid number');
        } else {
          if (question.minValue !== undefined && numValue < question.minValue) {
            errors.push(`Answer must be at least ${question.minValue}`);
          }
          if (question.maxValue !== undefined && numValue > question.maxValue) {
            errors.push(`Answer must be no more than ${question.maxValue}`);
          }
        }
        break;
      
      case 'multiple_choice':
        if (question.options && !question.options.includes(String(answer.value))) {
          errors.push('Invalid option selected');
        }
        break;
      
      case 'checkbox':
        if (Array.isArray(answer.value)) {
          const invalidOptions = answer.value.filter(val => !question.options?.includes(val));
          if (invalidOptions.length > 0) {
            errors.push('Some selected options are invalid');
          }
        }
        break;
    }
    
    return errors;
  },

  calculateProgress: (questions: SurveyQuestion[], answers: SurveyAnswer[]): number => {
    if (questions.length === 0) return 0;
    
    const answeredQuestions = answers.filter(answer => 
      answer.value !== undefined && 
      answer.value !== null && 
      answer.value !== ''
    ).length;
    
    return Math.round((answeredQuestions / questions.length) * 100);
  },

  getQuestionTypeLabel: (type: SurveyQuestion['type']): string => {
    switch (type) {
      case 'text':
        return 'Short Text';
      case 'textarea':
        return 'Long Text';
      case 'number':
        return 'Number';
      case 'rating':
        return 'Rating';
      case 'multiple_choice':
        return 'Multiple Choice';
      case 'checkbox':
        return 'Checkbox';
      default:
        return 'Unknown';
    }
  },

  getQuestionTypeIcon: (type: SurveyQuestion['type']): string => {
    switch (type) {
      case 'text':
        return '📝';
      case 'textarea':
        return '📄';
      case 'number':
        return '🔢';
      case 'rating':
        return '⭐';
      case 'multiple_choice':
        return '🔘';
      case 'checkbox':
        return '☑️';
      default:
        return '❓';
    }
  },

  generateDefaultQuestions: (type: 'engagement' | 'feedback' | 'exit' | 'onboarding'): SurveyQuestion[] => {
    switch (type) {
      case 'engagement':
        return [
          {
            id: '1',
            type: 'rating',
            question: 'How satisfied are you with your current role?',
            required: true,
            minValue: 1,
            maxValue: 5,
          },
          {
            id: '2',
            type: 'rating',
            question: 'How likely are you to recommend this company as a great place to work?',
            required: true,
            minValue: 1,
            maxValue: 10,
          },
          {
            id: '3',
            type: 'textarea',
            question: 'What do you enjoy most about your work?',
            required: false,
          },
          {
            id: '4',
            type: 'textarea',
            question: 'What would you change about your work environment?',
            required: false,
          },
        ];
      
      case 'feedback':
        return [
          {
            id: '1',
            type: 'rating',
            question: 'Rate the overall quality of communication in your team',
            required: true,
            minValue: 1,
            maxValue: 5,
          },
          {
            id: '2',
            type: 'multiple_choice',
            question: 'Which area needs the most improvement?',
            required: true,
            options: ['Communication', 'Processes', 'Tools', 'Training', 'Management'],
          },
          {
            id: '3',
            type: 'textarea',
            question: 'Please provide specific feedback or suggestions',
            required: false,
          },
        ];
      
      default:
        return [];
    }
  },
};

// TODO: Add surveys endpoints when implemented