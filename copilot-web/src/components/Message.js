import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism"; // Dark theme for code blocks
import "../styles/Message.css";
import Table from 'react-bootstrap/Table';

const Message = ({ text, isUser }) => {
  // Components for Markdown elements
  const components = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter
          style={dracula}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    // You can add more custom components for other markdown elements like links, images, etc.
    table({ node, children, ...props }) {
      return React.createElement(
        "table",
        { border: "1", cellPadding: "5", cellSpacing: "0", ...props },
        children
      );
    },
  };

  const renderTable = (markdownText) => {
    // Regular expression to match Markdown table syntax
    const regex = /!\[.*\]\(.*\) \|.*\n(.*?)\|\s*$/g;
    let match, tableData;

    while ((match = regex.exec(markdownText))) {
      tableData = match[1].split("|").map((row) => row.trim());
      // Add borders and padding to the rendered table
      return (
        <Table className="table table-responsive table-bordered table-stripped" border="1" cellPadding="5" cellSpacing="0">
          {tableData.map((row, index) => (
            <tr key={index}>
              {row.split(",").map((cell, columnIndex) => (
                <td key={columnIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </Table>
      );
    }

    // If no table is found, just render the original text
    return (
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {text}
      </ReactMarkdown>
    );
  };

  return (
    <div className={`message ${isUser ? "user" : "bot"}`}>
      <div className="message-content">{renderTable(text)}</div>
    </div>
  );
};

export default Message;
