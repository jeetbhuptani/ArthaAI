import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  explanation: string;
  onRegenerate: () => Promise<void>;
  isLoading: boolean;
}

export const ExplanationCard: React.FC<Props> = ({
  explanation,
  onRegenerate,
  isLoading,
}) => {
  return (
    <Card className="border-teal-100 dark:border-teal-900/50 shadow-md">
      <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 border-b border-teal-100 dark:border-teal-900/50">
        <CardTitle className="text-xl text-teal-800 dark:text-teal-300 flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Financial Document Explanation
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="p-4 rounded-md bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
            <p className="whitespace-pre-wrap text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {explanation}
              </ReactMarkdown>
            </p>
          </div>

          <Button
            onClick={onRegenerate}
            disabled={isLoading}
            className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Regenerating...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Regenerate Explanation
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
