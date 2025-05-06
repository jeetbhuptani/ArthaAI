// src/components/ExplanationCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";

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
    <Card className="mt-6 shadow-lg rounded-2xl border border-muted">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-foreground">
          📄 Financial Document Explanation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="whitespace-pre-wrap text-muted-foreground text-sm leading-relaxed">
            {explanation}
          </p>

          <Button onClick={onRegenerate} disabled={isLoading}>
            {isLoading ? (
              <>
                <ReloadIcon className="animate-spin mr-2" />
                Regenerating...
              </>
            ) : (
              <>
                <ReloadIcon className="mr-2" />
                Regenerate Explanation
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
