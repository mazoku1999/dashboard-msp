import { useState, useEffect, Suspense } from 'react';
import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import Highlight from '@tiptap/extension-highlight';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Typography from '@tiptap/extension-typography';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TextAlign from '@tiptap/extension-text-align';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Underline from '@tiptap/extension-underline';
import CharacterCount from '@tiptap/extension-character-count';
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    List,
    ListOrdered,
    Quote,
    Undo,
    Redo,
    Heading1,
    Heading2,
    Heading3,
    Link as LinkIcon,
    Image as ImageIcon,
    SplitSquareHorizontal,
    Eye,
    Edit3,
    CheckSquare,
    Highlighter,
    User,
} from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import TurndownService from 'turndown';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { marked } from 'marked';

interface MarkdownEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
    maxLength?: number;
    formData?: {
        category: string;
        title: string;
        author: string;
        image: string;
    };
    videoData?: {
        id: string;
        title: string;
        description: string;
    };
}

const lowlight = createLowlight(common);



marked.use({
    extensions: [{
        name: 'image',
        renderer(token) {
            return `<img src="${token.href}" alt="${token.text}" title="${token.title || ''}" class="rounded-md border max-w-full h-auto" />`;
        }
    }]
});

const MarkdownEditor = ({
    content,
    onChange,
    placeholder = 'Escribe tu contenido aquí...',
    maxLength,
    formData,
    videoData,
}: MarkdownEditorProps) => {
    const [mode, setMode] = useState<'edit' | 'preview' | 'split'>('edit');
    const [wordCount, setWordCount] = useState({ characters: 0, words: 0 });
    const [showImageDialog, setShowImageDialog] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [imageAlt, setImageAlt] = useState('');
    const [imageTitle, setImageTitle] = useState('');


    const parseContent = (markdown: string) => {
        // First convert images to HTML with our custom classes
        const withImages = markdown.replace(/!\[(.*?)\]\((.*?)(?:\s+"(.*?)")?\)/g, (_match, alt, src, title) => {
            const titleAttr = title ? ` title="${title.replace(/"/g, '&quot;')}"` : '';
            return `<img src="${src}" alt="${alt}"${titleAttr} class="rounded-md border w-full max-w-[500px] h-auto mx-auto my-4" />`;
        });

        // Then convert the rest of the markdown
        return marked.parse(withImages, { async: false }) as string;
    };

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3]
                }
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline underline-offset-4 hover:text-primary/80'
                }
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-md border w-full max-w-[500px] h-auto mx-auto my-4'
                },
                allowBase64: true,
            }),
            Placeholder.configure({
                placeholder,
            }),
            CodeBlockLowlight.configure({
                lowlight,
                defaultLanguage: 'javascript',
            }),
            Highlight.configure({
                multicolor: true,
            }),
            TextStyle,
            Color,
            Typography,
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Subscript,
            Superscript,
            Underline,
            CharacterCount.configure({
                limit: maxLength,
            }),
        ],
        content: parseContent(content),
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            const turndownService = new TurndownService({
                headingStyle: 'atx',
                codeBlockStyle: 'fenced'
            });
            const markdown = turndownService.turndown(html);
            onChange(markdown);
            setWordCount({
                characters: editor.storage.characterCount.characters(),
                words: editor.storage.characterCount.words(),
            });
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[500px] p-4'
            },
            handleDOMEvents: {
                keydown: (_view, event) => {
                    // Prevenir el comportamiento por defecto de algunas teclas
                    if (event.key === 'Enter' && event.shiftKey) {
                        return true;
                    }
                    return false;
                }
            },
            handleKeyDown: (_view, event) => {
                // Asegurarse de que el cursor se mantiene en la posición correcta
                if (event.key === 'Enter') {
                    return false;
                }
                return false;
            },
            handlePaste: () => {
                // Manejar el pegado de texto manteniendo la posición del cursor
                return false;
            }
        }
    });

    useEffect(() => {
        if (editor && content) {
            const currentCursor = editor.state.selection.$head.pos;
            editor.commands.setContent(parseContent(content));
            // Restaurar la posición del cursor
            editor.commands.setTextSelection(currentCursor);
        }
    }, [content, editor]);

    // Asegurarse de que el editor mantiene el foco
    useEffect(() => {
        if (editor && mode === 'edit') {
            editor.commands.focus();
        }
    }, [editor, mode]);



    if (!editor) {
        return null;
    }

    const handleImageSubmit = () => {
        if (imageUrl) {
            // Escape quotes in title if present
            const escapedTitle = imageTitle ? imageTitle.replace(/"/g, '&quot;') : '';
            const imageHtml = `<img src="${imageUrl}" alt="${imageAlt}" ${escapedTitle ? `title="${escapedTitle}"` : ''} class="rounded-md border max-w-full h-auto" />`;
            editor?.commands.insertContent(imageHtml);
            setShowImageDialog(false);
            setImageUrl('');
            setImageAlt('');
            setImageTitle('');
        }
    };

    const addLink = () => {
        const previousUrl = editor.getAttributes('link').href ?? '';
        const url = window.prompt('URL del enlace:', previousUrl);

        if (url === null) {
            return;
        }

        if (url === '') {
            editor.chain().focus().unsetLink().run();
            return;
        }

        editor.chain().focus().setLink({ href: url }).run();
    };




    return (
        <div className="rounded-md border bg-background flex flex-col h-full" onWheel={(e) => e.stopPropagation()}>
            <div className="w-full bg-gradient-to-r from-background via-violet-500 to-background" />
            <div className="border-b sticky top-16 bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/90 z-10 shadow-sm">
                <div className="h-px w-full bg-gradient-to-r from-violet-500/0 via-violet-500/80 to-violet-500/0" />
                <div className="flex flex-wrap items-center p-2 gap-1.5 overflow-x-auto">
                    <div className="flex flex-wrap items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                            className={cn("h-8 w-8 shrink-0", editor.isActive('heading', { level: 1 }) && 'bg-muted')}
                        >
                            <Heading1 className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                            className={cn("h-8 w-8 shrink-0", editor.isActive('heading', { level: 2 }) && 'bg-muted')}
                        >
                            <Heading2 className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                            className={cn("h-8 w-8 shrink-0", editor.isActive('heading', { level: 3 }) && 'bg-muted')}
                        >
                            <Heading3 className="h-4 w-4" />
                        </Button>

                        <Separator orientation="vertical" className="h-6 shrink-0" />

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            className={cn("h-8 w-8 shrink-0", editor.isActive('bold') && 'bg-muted')}
                        >
                            <Bold className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            className={cn("h-8 w-8 shrink-0", editor.isActive('italic') && 'bg-muted')}
                        >
                            <Italic className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => editor.chain().focus().toggleUnderline().run()}
                            className={cn("h-8 w-8 shrink-0", editor.isActive('underline') && 'bg-muted')}
                        >
                            <UnderlineIcon className="h-4 w-4" />
                        </Button>

                        <Separator orientation="vertical" className="h-6 shrink-0" />

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                            className={cn("h-8 w-8 shrink-0", editor.isActive('bulletList') && 'bg-muted')}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => editor.chain().focus().toggleOrderedList().run()}
                            className={cn("h-8 w-8 shrink-0", editor.isActive('orderedList') && 'bg-muted')}
                        >
                            <ListOrdered className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => editor.chain().focus().toggleTaskList().run()}
                            className={cn("h-8 w-8 shrink-0", editor.isActive('taskList') && 'bg-muted')}
                        >
                            <CheckSquare className="h-4 w-4" />
                        </Button>

                        <Separator orientation="vertical" className="h-6 shrink-0" />

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => editor.chain().focus().toggleBlockquote().run()}
                            className={cn("h-8 w-8 shrink-0", editor.isActive('blockquote') && 'bg-muted')}
                        >
                            <Quote className="h-4 w-4" />
                        </Button>


                        <Separator orientation="vertical" className="h-6 shrink-0" />

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={addLink}
                            className={cn("h-8 w-8 shrink-0", editor.isActive('link') && 'bg-muted')}
                        >
                            <LinkIcon className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowImageDialog(true)}
                            className="h-8 w-8 shrink-0"
                        >
                            <ImageIcon className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="flex-1" />

                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => editor.chain().focus().undo().run()}
                            className="h-8 w-8 shrink-0"
                        >
                            <Undo className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => editor.chain().focus().redo().run()}
                            className="h-8 w-8 shrink-0"
                        >
                            <Redo className="h-4 w-4" />
                        </Button>

                        <Separator orientation="vertical" className="h-6 shrink-0" />

                        <div className="flex items-center gap-2">
                            <Button
                                variant={mode === 'edit' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setMode('edit')}
                                className="gap-2"
                            >
                                <Edit3 className="h-4 w-4" />
                                <span className="hidden sm:inline">Editar</span>
                            </Button>
                            <Button
                                variant={mode === 'preview' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setMode('preview')}
                                className="gap-2"
                            >
                                <Eye className="h-4 w-4" />
                                <span className="hidden sm:inline">Vista previa</span>
                            </Button>
                            <Button
                                variant={mode === 'split' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setMode('split')}
                                className="gap-2"
                            >
                                <SplitSquareHorizontal className="h-4 w-4" />
                                <span className="hidden sm:inline">Split</span>
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="h-px w-full bg-gradient-to-r from-violet-500/0 via-violet-500/80 to-violet-500/0" />
            </div>

            <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Insertar imagen</DialogTitle>
                        <DialogDescription>
                            Ingresa los detalles de la imagen
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="imageUrl">URL de la imagen</Label>
                            <Input
                                id="imageUrl"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="https://ejemplo.com/imagen.jpg"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="imageAlt">Texto alternativo</Label>
                            <Input
                                id="imageAlt"
                                value={imageAlt}
                                onChange={(e) => setImageAlt(e.target.value)}
                                placeholder="Descripción de la imagen"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="imageTitle">Título</Label>
                            <Input
                                id="imageTitle"
                                value={imageTitle}
                                onChange={(e) => setImageTitle(e.target.value)}
                                placeholder="Título de la imagen"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowImageDialog(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleImageSubmit}>
                            Insertar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {
                editor && (
                    <BubbleMenu
                        className="flex overflow-hidden rounded-lg border bg-background shadow-md"
                        tippyOptions={{ duration: 100 }}
                        editor={editor}
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            className={cn("h-8 w-8", editor.isActive('bold') && 'bg-muted')}
                        >
                            <Bold className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            className={cn("h-8 w-8", editor.isActive('italic') && 'bg-muted')}
                        >
                            <Italic className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={addLink}
                            className={cn("h-8 w-8", editor.isActive('link') && 'bg-muted')}
                        >
                            <LinkIcon className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => editor.chain().focus().toggleHighlight().run()}
                            className={cn("h-8 w-8", editor.isActive('highlight') && 'bg-muted')}
                        >
                            <Highlighter className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => editor.chain().focus().toggleUnderline().run()}
                            className={cn("h-8 w-8", editor.isActive('underline') && 'bg-muted')}
                        >
                            <UnderlineIcon className="h-4 w-4" />
                        </Button>
                    </BubbleMenu>
                )
            }

            {
                editor && (
                    <FloatingMenu
                        className="flex overflow-hidden rounded-lg border bg-background shadow-md"
                        tippyOptions={{
                            duration: 100,
                            placement: 'bottom-start',
                            offset: [0, 10],
                            zIndex: 5
                        }}
                        editor={editor}
                        shouldShow={({ state }) => {
                            const { selection } = state;
                            const { empty, $anchor } = selection;
                            const isRootDepth = $anchor.depth === 1;
                            const isEmptyTextBlock = $anchor.parent.isTextblock && !$anchor.parent.textContent;
                            return empty && isRootDepth && isEmptyTextBlock;
                        }}
                    >
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                            className={cn(editor.isActive('heading', { level: 1 }) && 'bg-muted')}
                        >
                            <Heading1 className="h-4 w-4 mr-2" />
                            Título 1
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                            className={cn(editor.isActive('heading', { level: 2 }) && 'bg-muted')}
                        >
                            <Heading2 className="h-4 w-4 mr-2" />
                            Título 2
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                            className={cn(editor.isActive('bulletList') && 'bg-muted')}
                        >
                            <List className="h-4 w-4 mr-2" />
                            Lista
                        </Button>
                    </FloatingMenu>
                )
            }

            <div className={cn(
                'grid flex-1 isolate',
                mode === 'split' && 'grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x'
            )}>
                <div
                    className={cn(
                        'overflow-y-auto overscroll-contain',
                        mode === 'preview' && 'hidden',
                        mode === 'split' && 'border-r max-h-[calc(100vh-13rem)]'
                    )}
                    style={{ scrollbarGutter: 'stable' }}
                >
                    <EditorContent editor={editor} className="min-h-[500px] max-w-full" />
                </div>
                {(mode === 'preview' || mode === 'split') && (
                    <div
                        className="overflow-y-auto overscroll-contain max-h-[calc(100vh-13rem)] bg-background"
                        style={{ scrollbarGutter: 'stable' }}
                    >
                        <Suspense fallback={<div className="min-h-[50vh] w-full flex items-center justify-center">
                            <div className="animate-pulse text-lg text-muted-foreground">Loading preview...</div>
                        </div>}>
                            {/* Hero Section */}
                            <div className="relative min-h-[30vh] sm:min-h-[40vh] md:min-h-[50vh] w-full overflow-hidden">
                                {/* Imagen de fondo con efectos */}
                                <div className="absolute inset-0">
                                    <img
                                        src={formData?.image || "https://dircomfidencial.com/wp-content/uploads/2015/06/portadas-periodicos.jpg"}
                                        alt={formData?.title}
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Efectos de brillo con máscara de degradado */}
                                    <div className="absolute inset-0">
                                        <div className="absolute top-12 -right-12 w-48 sm:w-72 md:w-96 aspect-square bg-violet-500/40 rounded-full blur-3xl animate-pulse opacity-70" />
                                        <div className="absolute -bottom-12 -left-12 w-48 sm:w-72 md:w-96 aspect-square bg-fuchsia-500/40 rounded-full blur-3xl animate-pulse delay-1000 opacity-70" />
                                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-background/80 to-background" />
                                    </div>
                                    <div className="absolute inset-0 bg-[url('/effects/grid.svg')] opacity-10" />
                                </div>

                                {/* Contenido del hero */}
                                <div className="relative h-full w-full px-4 py-6">
                                    <div className="h-full flex flex-col max-w-4xl mx-auto">
                                        {/* Contenido central */}
                                        <div className="mt-40 mb-6 sm:mb-8">
                                            {/* Categoría */}
                                            <div className="mb-3">
                                                <span className="inline-flex items-center rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium bg-violet-500/20 hover:bg-violet-500/30 text-white backdrop-blur-sm">
                                                    {formData?.category || "Sin categoría"}
                                                </span>
                                            </div>


                                            {/* Título */}
                                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight break-words">
                                                {formData?.title || "Preview Title"}
                                            </h1>

                                            {/* Autor y acciones */}
                                            <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
                                                <div className="flex items-center gap-2 sm:gap-3 backdrop-blur-sm bg-white/10 rounded-full pl-2 pr-3 sm:pr-4 py-1 sm:py-1.5">
                                                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 p-[2px] shrink-0">
                                                        <div className="h-full w-full rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                                                            <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm sm:text-base text-white font-medium break-words">{formData?.author || "Author Name"}</p>
                                                        <p className="text-xs sm:text-sm text-white/60">
                                                            {new Date().toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Suspense>

                        {/* Contenido principal */}
                        <main className="w-full px-4 py-6 sm:py-8">
                            <article className="max-w-4xl mx-auto">
                                <div className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        rehypePlugins={[rehypeRaw, rehypeSanitize]}
                                        className="markdown-content break-words"
                                        components={{
                                            h1: ({ node, ...props }) => (
                                                <h1 className="text-3xl font-bold mb-6" {...props} />
                                            ),
                                            h2: ({ node, ...props }) => (
                                                <h2 className="text-2xl font-semibold mt-10 mb-4" {...props} />
                                            ),
                                            h3: ({ node, ...props }) => (
                                                <h3 className="text-xl font-medium mt-8 mb-4" {...props} />
                                            ),
                                            p: ({ node, children, ...props }) => {
                                                if (node?.children[0]?.type === 'element' && node.children[0].tagName === 'img') {
                                                    return <>{children}</>;
                                                }
                                                return (
                                                    <p className="text-base leading-relaxed text-muted-foreground mb-6" {...props}>
                                                        {children}
                                                    </p>
                                                );
                                            },
                                            ul: ({ node, ...props }) => (
                                                <ul className="list-disc pl-6 mb-6 space-y-2" {...props} />
                                            ),
                                            li: ({ node, ...props }) => (
                                                <li className="text-muted-foreground" {...props} />
                                            ),
                                            blockquote: ({ node, ...props }) => (
                                                <blockquote className="border-l-4 border-violet-500 pl-4 my-6 italic text-muted-foreground" {...props} />
                                            ),
                                            a: ({ node, ...props }) => (
                                                <a className="text-violet-500 hover:text-violet-600 transition-colors" {...props} />
                                            ),
                                            img: ({ node, ...props }) => (
                                                <div className="relative group my-8">
                                                    <div className="absolute -inset-2 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 rounded-3xl blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-500" />
                                                    <div className="relative rounded-3xl overflow-hidden">
                                                        <img {...props} className="w-full h-full object-cover rounded-3xl" />
                                                    </div>
                                                </div>
                                            ),
                                        }}
                                    >
                                        {content}
                                    </ReactMarkdown>
                                </div>

                                {/* Sección de Video */}
                                {videoData?.id && (
                                    <div className="mt-20 space-y-12">
                                        {/* Separador decorativo */}
                                        <div className="relative">
                                            <div className="absolute inset-0 flex items-center">
                                                <div className="w-full h-px bg-gradient-to-r from-background via-violet-500/30 to-background" />
                                            </div>
                                            <div className="relative flex justify-center">
                                                <div className="bg-background px-6 py-2 rounded-full border border-violet-500/20">
                                                    <span className="text-sm font-medium text-violet-400">
                                                        Featured Video
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Título del video */}
                                        <div className="text-center space-y-4 max-w-2xl mx-auto">
                                            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500">
                                                {videoData.title}
                                            </h2>
                                            {videoData.description && (
                                                <p className="text-lg text-zinc-500 dark:text-zinc-400">
                                                    {videoData.description}
                                                </p>
                                            )}
                                        </div>

                                        {/* Contenedor del video */}
                                        <div className="relative group">
                                            <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 rounded-2xl sm:rounded-3xl blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-500" />
                                            <div className="relative aspect-video w-full rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-900 shadow-2xl ring-1 ring-white/20">
                                                <iframe
                                                    width="100%"
                                                    height="100%"
                                                    src={`https://www.youtube.com/embed/${videoData.id}`}
                                                    title={videoData.title}
                                                    frameBorder="0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                    className="w-full h-full"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </article>
                        </main>
                    </div>
                )}
            </div>

            <div className="border-t sticky bottom-0 bg-background z-10 p-2 flex flex-wrap justify-between items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <div className="flex flex-wrap items-center gap-2">
                    <span>{wordCount.words} palabras</span>
                    {maxLength && (
                        <span>
                            {wordCount.characters}/{maxLength} caracteres
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <span className="hidden sm:inline">Presiona</span>
                    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                        <span className="text-xs">⌘</span>K
                    </kbd>
                    <span className="hidden sm:inline">para comandos</span>
                </div>
            </div>
        </div >
    );
};

export default MarkdownEditor; 