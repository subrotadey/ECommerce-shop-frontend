// src/components/ProductForm/DescriptionEditor.jsx

import React, { useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const MenuBar = ({ editor }) => {
    if (!editor) {
        return null;
    }

    const buttonClass = (isActive) =>
        `px-3 py-1.5 rounded text-sm font-medium transition-colors ${isActive
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
        }`;

    return (
        <div className="border-b p-2 flex flex-wrap gap-2 bg-gray-50">
            {/* Headers */}
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={buttonClass(editor.isActive('heading', { level: 2 }))}
                title="Heading 2"
            >
                H2
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={buttonClass(editor.isActive('heading', { level: 3 }))}
                title="Heading 3"
            >
                H3
            </button>

            <div className="w-px h-8 bg-gray-300 mx-1" />

            {/* Text Formatting */}
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={buttonClass(editor.isActive('bold'))}
                title="Bold (Ctrl+B)"
            >
                <strong>B</strong>
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={buttonClass(editor.isActive('italic'))}
                title="Italic (Ctrl+I)"
            >
                <em>I</em>
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={buttonClass(editor.isActive('strike'))}
                title="Strikethrough"
            >
                <s>S</s>
            </button>

            <div className="w-px h-8 bg-gray-300 mx-1" />

            {/* Lists */}
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={buttonClass(editor.isActive('bulletList'))}
                title="Bullet List"
            >
                • List
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={buttonClass(editor.isActive('orderedList'))}
                title="Numbered List"
            >
                1. List
            </button>

            <div className="w-px h-8 bg-gray-300 mx-1" />

            {/* Clear Formatting */}
            <button
                type="button"
                onClick={() => editor.chain().focus().unsetAllMarks().run()}
                className="px-3 py-1.5 rounded text-sm bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                title="Clear Formatting"
            >
                Clear
            </button>
        </div>
    );
};

const DescriptionEditor = ({ value, onChange, error }) => {
    // সর্বশেষ onChange ref-এ রাখা হয়, যাতে editor বারবার নতুন করে তৈরি না হয়।
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [2, 3],
                },
            }),
        ],
        content: value || '<p></p>',
        immediatelyRender: false,
        shouldRerenderOnTransaction: false,
        editorProps: {
            attributes: {
                class: 'prose prose-sm max-w-none focus:outline-none min-h-[250px] p-4',
            },
        },
        onUpdate: ({ editor }) => {
            onChangeRef.current?.(editor.getHTML());
        },
    }, []);

    // শুধু বাইরের কারণে value বদলালে (যেমন Reset) editor আপডেট হবে।
    // Editor-এ focus থাকলে (ব্যবহারকারী লিখছে) কখনো ছোঁয়া হবে না।
    useEffect(() => {
        if (!editor || value === undefined) return;
        if (editor.isFocused) return;

        if (value !== editor.getHTML()) {
            editor.commands.setContent(value || '<p></p>', false);
        }
    }, [value, editor]);

    const characterCount = editor ? editor.getText().length : 0;
    const isMinimumMet = characterCount >= 50;

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                Product Description <span className="text-red-500">*</span>
            </label>

            <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
                <MenuBar editor={editor} />
                <EditorContent editor={editor} />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            {/* Character count and tips */}
            <div className="flex items-center justify-between text-xs text-gray-500">
                <div>
                    <span className={!isMinimumMet ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}>
                        {characterCount} characters
                    </span>
                    {!isMinimumMet && (
                        <span className="ml-2 text-red-600">
                            (Minimum 50 required - {50 - characterCount} more needed)
                        </span>
                    )}
                </div>
                <div className="text-gray-400">
                    Use H2 for main headings, H3 for subheadings
                </div>
            </div>
        </div>
    );
};

export default DescriptionEditor;