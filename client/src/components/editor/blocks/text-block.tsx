interface TextBlockProps {
  data: Record<string, any>;
  isActive: boolean;
  onUpdate: (data: Record<string, any>) => void;
}

export function TextBlockEditor({ data, isActive, onUpdate }: TextBlockProps) {
  return (
    <div className="py-8 px-8 max-w-3xl mx-auto">
      <div
        className="prose prose-sm max-w-none outline-none"
        contentEditable={isActive}
        suppressContentEditableWarning
        dangerouslySetInnerHTML={{ __html: data.content || '<p>Enter text here...</p>' }}
        onBlur={e => onUpdate({ content: e.currentTarget.innerHTML })}
      />
    </div>
  );
}
