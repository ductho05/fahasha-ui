import React, { useState, useEffect } from 'react';
import { RiDoubleQuotesL, RiCodeSSlashFill, RiLinksFill, RiListCheck, RiListOrdered, RiImage2Line } from 'react-icons/ri'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'

function MarkdownEditor() {
    const [content, setContent] = useState('');
    const [result, setResult] = useState("");
    const [selectionStart, setSelectionStart] = useState(0);
    const [selectionEnd, setSelectionEnd] = useState(0);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setResult(content)
        }, 800);
        return () => clearTimeout(timeout);
    }, [content]);

    const addHeading1 = (text) => {
        return `# ${text}`;
    };

    const addHeading2 = (text) => {
        return `## ${text}`;
    };

    const addHeading3 = (text) => {
        return `### ${text}`;
    };

    const addHeading4 = (text) => {
        return `#### ${text}`;
    };

    const addHeading5 = (text) => {
        return `##### ${text}`;
    };

    const addHeading6 = (text) => {
        return `###### ${text}`;
    };

    const addBoldText = (text) => {
        return `**${text}**`;
    };

    const addItalicText = (text) => {
        return `*${text}*`;
    };

    const addQuote = (text) => {
        return `> ${text}`;
    };

    const addBlockCode = (text) => {
        return '```\n' + text + '\n```';
    };

    const addLink = (text, link) => {
        return `[${text}](${link})`;
    };

    const addList = (text) => {
        return `- ${text}`;
    };

    const addOrderedList = (text) => {
        return `1. ${text}`;
    };

    const addImage = (text, link) => {
        return `![${text}](${link})`;
    };

    const applyMarkdown = (markdownFunction) => {
        const selectedText = content.substring(selectionStart, selectionEnd);
        const newContent = `${content.substring(0, selectionStart)}${markdownFunction(selectedText)}${content.substring(selectionEnd)}`;
        setContent(newContent);
    };

    return (
        <div className="flex">
            <div className="w-1/2 p-4">
                <div className="mb-4">
                    <ul className="flex flex-wrap space-x-2">
                        <li onClick={() => applyMarkdown(addHeading1)} className="markdown-button">H1</li>
                        <li onClick={() => applyMarkdown(addHeading2)} className="markdown-button">H2</li>
                        <li onClick={() => applyMarkdown(addHeading3)}>H3</li>
                        <li onClick={() => applyMarkdown(addHeading4)}>H4</li>
                        <li onClick={() => applyMarkdown(addHeading5)}>H5</li>
                        <li onClick={() => applyMarkdown(addHeading6)}>H6</li>
                        <li onClick={() => applyMarkdown(addBoldText)} title="Bold"><b>B</b></li>
                        <li onClick={() => applyMarkdown(addItalicText)} title="Italic"><i>I</i></li>
                        <li onClick={() => applyMarkdown(addQuote)} title="Quote"><RiDoubleQuotesL /></li>
                        <li onClick={() => applyMarkdown(addBlockCode)} title="Block code"><RiCodeSSlashFill /></li>
                        <li onClick={() => applyMarkdown(addLink)} title="Link"><RiLinksFill /></li>
                        <li onClick={() => applyMarkdown(addList)} title="List"><RiListCheck /></li>
                        <li onClick={() => applyMarkdown(addOrderedList)} title="Ordered List"><RiListOrdered /></li>
                        <li onClick={() => applyMarkdown(addImage)} title="Image"><RiImage2Line /></li>
                        {/* Thêm các nút khác tại đây */}
                    </ul>
                </div>
                <div className="mb-4">
                    <textarea
                        value={content}
                        onChange={(e) => {
                            setContent(e.target.value);
                        }}
                        onSelect={(e) => {
                            setSelectionStart(e.target.selectionStart);
                            setSelectionEnd(e.target.selectionEnd);
                        }}
                        rows={200}
                        className="w-full h-32 border rounded p-2"
                    />

                </div>
            </div>
            <div className="w-1/2 p-4">
                <h3>Preview:</h3>
                <div className="border rounded p-4">
                    <ReactMarkdown remarkPlugins={[gfm]} children={result} />
                </div>
            </div>
        </div>
    );
}

export default MarkdownEditor;