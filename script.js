function parseCookies() {
    const input = document.getElementById('cookieInput').value.trim();
    const resultsDiv = document.getElementById('results');
    
    if (!input) {
        resultsDiv.innerHTML = '<div class="empty-state">Please enter a cookie string to parse.</div>';
        return;
    }

    try {
        // Parse the cookie string
        const cookies = parseCookieString(input);
        
        if (cookies.length === 0) {
            resultsDiv.innerHTML = `
                <div class="empty-state">
                    <strong>No valid cookies found</strong><br>
                    Please check that your input contains valid cookie pairs in the format:<br>
                    <code>cookieName=cookieValue; anotherCookie=anotherValue</code><br><br>
                    Cookie names must contain only letters, numbers, underscores, hyphens, or dots.
                </div>
            `;
            return;
        }

        // Display the results in a table
        let html = `
            <div class="filter-container show">
                <label class="filter-label" for="cookieFilter">Filter by cookie name:</label>
                <input type="text" id="cookieFilter" class="filter-input" placeholder="Type to filter cookies..." oninput="filterCookies()">
            </div>
            <table class="cookies-table">
                <thead>
                    <tr>
                        <th>Cookie Name</th>
                        <th>Cookie Value</th>
                    </tr>
                </thead>
                <tbody id="cookieTableBody">
        `;
        
        cookies.forEach(cookie => {
            html += `
                <tr class="cookie-row" data-cookie-name="${escapeHtml(cookie.key).toLowerCase()}" onclick="copyToClipboard('${escapeForAttribute(cookie.value)}', this)">
                    <td class="cookie-key" title="${escapeHtml(cookie.key)}">${escapeHtml(cookie.key)}</td>
                    <td class="cookie-value" title="${escapeHtml(cookie.value)}">
                        <div class="cookie-text">${escapeHtml(cookie.value)}</div>
                        <span class="copied-indicator">✓ Copied!</span>
                    </td>
                </tr>
            `;
        });
        
        html += `
                </tbody>
            </table>
            <div class="count" id="cookieCount">Found ${cookies.length} cookie${cookies.length !== 1 ? 's' : ''} • Click any row to copy the value</div>
        `;
        resultsDiv.innerHTML = html;
        
    } catch (error) {
        resultsDiv.innerHTML = `<div class="empty-state">Error parsing cookies: ${escapeHtml(error.message)}</div>`;
    }
}

function parseCookieString(cookieString) {
    const cookies = [];
    let hasValidKeyValuePair = false;
    
    // Split by semicolon and process each cookie
    const cookiePairs = cookieString.split(';');
    
    cookiePairs.forEach(pair => {
        const trimmedPair = pair.trim();
        if (!trimmedPair) return;
        
        // Find the first equals sign (in case the value contains equals signs)
        const equalsIndex = trimmedPair.indexOf('=');
        
        if (equalsIndex === -1) {
            // No equals sign found - only allow if it looks like a valid cookie name
            // AND we already have at least one valid key=value pair in the string
            if (/^[a-zA-Z0-9_.-]+$/.test(trimmedPair) && hasValidKeyValuePair) {
                cookies.push({
                    key: trimmedPair,
                    value: 'true'
                });
            }
        } else if (equalsIndex > 0) {
            // Must have a non-empty key before the equals sign
            const key = trimmedPair.substring(0, equalsIndex).trim();
            const value = trimmedPair.substring(equalsIndex + 1).trim();
            
            // Validate cookie name format
            if (key && /^[a-zA-Z0-9_.-]+$/.test(key)) {
                cookies.push({
                    key: key,
                    value: value || ''
                });
                hasValidKeyValuePair = true;
            }
        }
        // If equalsIndex is 0, it means the string starts with '=', which is invalid
    });
    
    // If we don't have any valid key=value pairs, reject everything
    if (!hasValidKeyValuePair) {
        return [];
    }
    
    return cookies;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function escapeForAttribute(text) {
    return text.replace(/'/g, "\\'").replace(/"/g, '\\"');
}

function copyToClipboard(value, row) {
    navigator.clipboard.writeText(value).then(() => {
        // Visual feedback
        const originalBg = row.style.backgroundColor;
        row.style.backgroundColor = '#d4edda';
        row.style.transition = 'background-color 0.3s';
        
        // Show copied indicator in the row
        const copiedIndicator = row.querySelector('.copied-indicator');
        copiedIndicator.classList.add('show');
        
        // Show temporary message
        const originalCount = document.querySelector('.count').innerHTML;
        document.querySelector('.count').innerHTML = '✓ Copied to clipboard!';
        
        setTimeout(() => {
            row.style.backgroundColor = originalBg;
            copiedIndicator.classList.remove('show');
            document.querySelector('.count').innerHTML = originalCount;
        }, 1500);
    }).catch(err => {
        console.error('Failed to copy: ', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = value;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        // Show copied indicator in the row (fallback)
        const copiedIndicator = row.querySelector('.copied-indicator');
        copiedIndicator.classList.add('show');
        
        // Visual feedback for fallback
        const originalCount = document.querySelector('.count').innerHTML;
        document.querySelector('.count').innerHTML = '✓ Copied to clipboard!';
        setTimeout(() => {
            copiedIndicator.classList.remove('show');
            document.querySelector('.count').innerHTML = originalCount;
        }, 1500);
    });
}

function clearResults() {
    document.getElementById('cookieInput').value = '';
    document.getElementById('results').innerHTML = '';
}

function filterCookies() {
    const filterValue = document.getElementById('cookieFilter').value.toLowerCase();
    const tableBody = document.getElementById('cookieTableBody');
    const rows = tableBody.querySelectorAll('.cookie-row');
    let visibleCount = 0;

    rows.forEach(row => {
        const cookieName = row.getAttribute('data-cookie-name');
        if (cookieName.includes(filterValue)) {
            row.classList.remove('hidden-row');
            visibleCount++;
        } else {
            row.classList.add('hidden-row');
        }
    });

    // Update the count
    const totalCount = rows.length;
    const countElement = document.getElementById('cookieCount');
    if (filterValue === '') {
        countElement.innerHTML = `Found ${totalCount} cookie${totalCount !== 1 ? 's' : ''} • Click any row to copy the value`;
    } else {
        countElement.innerHTML = `Showing ${visibleCount} of ${totalCount} cookie${totalCount !== 1 ? 's' : ''} • Click any row to copy the value`;
    }
}

// Auto-parse when Enter is pressed in textarea
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('cookieInput').addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            parseCookies();
        }
    });
});
