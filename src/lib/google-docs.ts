import { google, docs_v1 } from 'googleapis';

// Vercel-compatible Google Docs initialization
function initializeDocs() {
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
        throw new Error('Google Docs configuration error: Missing credentials');
    }

    // Fix private key formatting for Vercel
    const privateKey = process.env.GOOGLE_PRIVATE_KEY
        .replace(/\\n/g, '\n')
        .replace(/"/g, '') // Remove any quotes
        .trim();

    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: privateKey,
        },
        scopes: ['https://www.googleapis.com/auth/documents.readonly'],
    });

    return google.docs({ version: 'v1', auth });
}

export async function getGoogleDocContent(docId: string): Promise<string> {
    try {
        const docs = initializeDocs();
        const response = await docs.documents.get({
            documentId: docId,
        });

        if (!response.data.body || !response.data.body.content) {
            return '';
        }

        // Convert the Google Doc structure to HTML
        return parseDocToHtml(response.data.body.content, response.data.inlineObjects);
    } catch (error) {
        console.error('Error fetching Google Doc:', error);
        return '<p>Error loading content.</p>';
    }
}

// Highly robust parser for Google Docs structural elements to HTML
function parseDocToHtml(content: docs_v1.Schema$StructuralElement[], inlineObjects?: { [key: string]: docs_v1.Schema$InlineObject }): string {
    let html = '';

    // Track list items to close ul/ol tags properly
    let inList = false;

    content.forEach((element) => {
        // 1. Paragraph (which covers headings, normal text, and lists)
        if (element.paragraph) {
            const p = element.paragraph;
            const elements = p.elements || [];
            const style = p.paragraphStyle;

            // Handle list starts and ends
            const isList = !!p.bullet;
            if (isList && !inList) {
                html += '<ul>\n';
                inList = true;
            } else if (!isList && inList) {
                html += '</ul>\n';
                inList = false;
            }

            let innerHtml = '';
            elements.forEach(el => {
                if (el.textRun) {
                    let text = el.textRun.content || '';
                    const textStyle = el.textRun.textStyle || {};

                    if (textStyle.link && textStyle.link.url) {
                        // Handle Links
                        text = `<a href="${textStyle.link.url}" target="_blank" rel="noopener noreferrer">${text.trim()}</a>`;
                        if (el.textRun.content?.endsWith(' ')) text += ' ';
                        if (el.textRun.content?.startsWith(' ')) text = ' ' + text;
                    } else {
                        // Handle Formatting
                        text = escapeHtml(text).replace(/\\n/g, '<br />');
                        if (textStyle.bold) text = `<strong>${text}</strong>`;
                        if (textStyle.italic) text = `<em>${text}</em>`;
                        if (textStyle.underline && !textStyle.link) text = `<u>${text}</u>`;
                        if (textStyle.strikethrough) text = `<del>${text}</del>`;
                    }
                    innerHtml += text;
                } else if (el.inlineObjectElement) {
                    const objectId = el.inlineObjectElement.inlineObjectId;
                    if (objectId && inlineObjects && inlineObjects[objectId]) {
                        const inlineObject = inlineObjects[objectId];
                        const embeddedObject = inlineObject.inlineObjectProperties?.embeddedObject;

                        if (embeddedObject && embeddedObject.imageProperties) {
                            const contentUri = embeddedObject.imageProperties.contentUri;
                            const title = embeddedObject.title || 'Image';
                            if (contentUri) {
                                innerHtml += `<img src="${contentUri}" alt="${escapeHtml(title)}" className="w-full rounded-xl my-4 object-cover" />`;
                            }
                        }
                    }
                }
            });

            if (!innerHtml.trim()) return; // Skip completely empty paragraphs

            if (isList) {
                html += `<li>${innerHtml}</li>\n`;
            } else {
                const namedStyleType = style?.namedStyleType;
                switch (namedStyleType) {
                    case 'HEADING_1':
                        html += `<h1>${innerHtml}</h1>\n`;
                        break;
                    case 'HEADING_2':
                        html += `<h2>${innerHtml}</h2>\n`;
                        break;
                    case 'HEADING_3':
                        html += `<h3>${innerHtml}</h3>\n`;
                        break;
                    case 'HEADING_4':
                        html += `<h4>${innerHtml}</h4>\n`;
                        break;
                    case 'HEADING_5':
                        html += `<h5>${innerHtml}</h5>\n`;
                        break;
                    case 'HEADING_6':
                        html += `<h6>${innerHtml}</h6>\n`;
                        break;
                    default:
                        html += `<p>${innerHtml}</p>\n`;
                }
            }
        }
    });

    // Make sure to close any dangling list tags
    if (inList) {
        html += '</ul>\n';
    }

    return html;
}

function escapeHtml(unsafe: string): string {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
