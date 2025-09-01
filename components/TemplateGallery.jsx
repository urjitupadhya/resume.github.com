"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Template1 from "@/templates/Template1"
import Template2 from "@/templates/Template2"
import Template3 from "@/templates/Template3"
import Template4 from "@/templates/Template4"
import Template5 from "@/templates/Template5"
import Template6 from "@/templates/Template6"
import Template7 from "@/templates/Template7"
import { cn } from "@/lib/utils"

const templateComponentMap = {
  template1: Template1,
  template2: Template2,
  template3: Template3,
  template4: Template4,
  template5: Template5,
  template6: Template6,
  template7: Template7,
}

export default function TemplateGallery({ templates, selectedTemplate, onSelect, resume }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {templates.map((tpl) => {
        const TplComp = templateComponentMap[tpl.id]
        return (
          <Card
            key={tpl.id}
            onClick={() => onSelect(tpl.id)}
            style={{ cursor: "pointer" }}
            className={cn(
              "overflow-hidden transition-all duration-200",
              selectedTemplate === tpl.id
                ? "ring-2 ring-primary shadow-sm"
                : "hover:bg-muted/50 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/40",
            )}
          >
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">{tpl.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {/* Thumbnail preview: scaled rendering of the template */}
              <div className="h-48 w-full overflow-hidden bg-background border-t">
                <div
                  className="origin-top-left"
                  style={{
                    transform: "scale(0.35)",
                    width: "800px",
                    height: "1131px",
                  }}
                >
                  <div className="w-[800px] h-[1131px] p-8 bg-card text-card-foreground">
                    <TplComp resume={resume} />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between gap-2">
              <Button
                size="sm"
                variant={selectedTemplate === tpl.id ? "default" : "outline"}
                onClick={() => onSelect(tpl.id)}
                className="w-full"
              >
                {selectedTemplate === tpl.id ? "Using" : "Use Template"}
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
