import { Extension } from '@tiptap/core';
import { ReactRenderer } from '@tiptap/react';
import Suggestion from '@tiptap/suggestion';
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Card } from '@/components/ui/card';
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Image,
  Minus,
} from 'lucide-react';

interface CommandItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  command: (editor: any) => void;
}

const commands: CommandItem[] = [
  {
    title: 'Heading 1',
    description: 'Big section heading',
    icon: <Heading1 className="w-4 h-4" />,
    command: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    title: 'Heading 2',
    description: 'Medium section heading',
    icon: <Heading2 className="w-4 h-4" />,
    command: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    title: 'Heading 3',
    description: 'Small section heading',
    icon: <Heading3 className="w-4 h-4" />,
    command: (editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
  },
  {
    title: 'Bullet List',
    description: 'Create a simple bullet list',
    icon: <List className="w-4 h-4" />,
    command: (editor) => editor.chain().focus().toggleBulletList().run(),
  },
  {
    title: 'Numbered List',
    description: 'Create a numbered list',
    icon: <ListOrdered className="w-4 h-4" />,
    command: (editor) => editor.chain().focus().toggleOrderedList().run(),
  },
  {
    title: 'Quote',
    description: 'Capture a quote',
    icon: <Quote className="w-4 h-4" />,
    command: (editor) => editor.chain().focus().toggleBlockquote().run(),
  },
  {
    title: 'Code Block',
    description: 'Capture a code snippet',
    icon: <Code className="w-4 h-4" />,
    command: (editor) => editor.chain().focus().toggleCodeBlock().run(),
  },
  {
    title: 'Image',
    description: 'Upload an image',
    icon: <Image className="w-4 h-4" />,
    command: (editor) => {
      const url = window.prompt('Enter image URL:');
      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    },
  },
  {
    title: 'Divider',
    description: 'Visually divide blocks',
    icon: <Minus className="w-4 h-4" />,
    command: (editor) => editor.chain().focus().setHorizontalRule().run(),
  },
];

interface CommandListProps {
  items: CommandItem[];
  command: (item: CommandItem) => void;
}

const CommandList = forwardRef<any, CommandListProps>(({ items, command }, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = items[index];
    if (item) {
      command(item);
    }
  };

  const upHandler = () => {
    setSelectedIndex((selectedIndex + items.length - 1) % items.length);
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        upHandler();
        return true;
      }

      if (event.key === 'ArrowDown') {
        downHandler();
        return true;
      }

      if (event.key === 'Enter') {
        enterHandler();
        return true;
      }

      return false;
    },
  }));

  return (
    <Card className="p-2 shadow-lg border max-h-80 overflow-auto">
      {items.length ? (
        items.map((item, index) => (
          <button
            key={index}
            className={`flex items-center gap-3 w-full p-2 rounded text-left hover:bg-accent ${
              index === selectedIndex ? 'bg-accent' : ''
            }`}
            onClick={() => selectItem(index)}
          >
            {item.icon}
            <div>
              <div className="font-medium text-sm">{item.title}</div>
              <div className="text-xs text-muted-foreground">{item.description}</div>
            </div>
          </button>
        ))
      ) : (
        <div className="p-2 text-sm text-muted-foreground">No results</div>
      )}
    </Card>
  );
});

CommandList.displayName = 'CommandList';

const SlashCommands = Extension.create({
  name: 'slashCommands',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({ editor, range, props }: any) => {
          props.command(editor, range);
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
        items: ({ query }: { query: string }) => {
          return commands.filter((item) =>
            item.title.toLowerCase().startsWith(query.toLowerCase())
          );
        },
        render: () => {
          let component: ReactRenderer;
          let popup: any;

          return {
            onStart: (props: any) => {
              component = new ReactRenderer(CommandList, {
                props,
                editor: props.editor,
              });

              if (!props.clientRect) {
                return;
              }

              popup = document.createElement('div');
              popup.style.position = 'absolute';
              popup.style.zIndex = '1000';
              document.body.appendChild(popup);
              popup.appendChild(component.element);

              const rect = props.clientRect();
              popup.style.top = `${rect.bottom + 8}px`;
              popup.style.left = `${rect.left}px`;
            },

            onUpdate(props: any) {
              component.updateProps(props);

              if (!props.clientRect) {
                return;
              }

              const rect = props.clientRect();
              popup.style.top = `${rect.bottom + 8}px`;
              popup.style.left = `${rect.left}px`;
            },

            onKeyDown(props: any) {
              if (props.event.key === 'Escape') {
                popup.remove();
                component.destroy();
                return true;
              }

              return component.ref?.onKeyDown(props);
            },

            onExit() {
              popup.remove();
              component.destroy();
            },
          };
        },
      }),
    ];
  },
});

export default SlashCommands;