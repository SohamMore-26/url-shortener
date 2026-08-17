import { useState } from "react";

async function getErrorMessage(response) {
  const data = await response.json().catch(() => null);
  return data?.error || "Something went wrong. Please try again.";
}

function extractShortCode(value) {
  const trimmedValue = value.trim();

  try {
    const url = new URL(trimmedValue);
    return url.pathname.replace(/^\//, "").split("/")[0];
  } catch {
    return trimmedValue.replace(/^\//, "");
  }
}

function App() {
  const [longUrl, setLongUrl] = useState("");
  const [createdUrl, setCreatedUrl] = useState(null);
  const [shortCode, setShortCode] = useState("");
  const [statistics, setStatistics] = useState(null);
  const [error, setError] = useState("");
  const [isShortening, setIsShortening] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  async function handleShorten(event) {
    event.preventDefault();
    setError("");
    setCreatedUrl(null);
    setIsShortening(true);

    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ longUrl }),
      });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      const url = await response.json();
      setCreatedUrl(url);
      setShortCode(url.shortCode);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsShortening(false);
    }
  }

  async function handleStats(event) {
    event.preventDefault();
    setError("");
    setStatistics(null);
    setIsLoadingStats(true);

    try {
      const code = extractShortCode(shortCode);
      const response = await fetch(`/api/stats/${encodeURIComponent(code)}`);

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      setStatistics(await response.json());
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoadingStats(false);
    }
  }

  async function copyShortUrl() {
    if (!createdUrl) return;

    await navigator.clipboard.writeText(createdUrl.shortUrl);
  }

  return (
    <main className="page-shell">
      <section className="hero" aria-labelledby="page-title">
        <p className="eyebrow">Simple link management</p>
        <h1 id="page-title">Shorten, share, and measure.</h1>
        <p className="intro">
          Turn long links into concise URLs, then view the clicks they receive.
        </p>
      </section>

      <section className="card" aria-labelledby="shorten-title">
        <h2 id="shorten-title">Create a short link</h2>
        <form onSubmit={handleShorten}>
          <label htmlFor="long-url">Long URL</label>
          <div className="form-row">
            <input
              id="long-url"
              type="url"
              placeholder="https://example.com/a/very/long/link"
              value={longUrl}
              onChange={(event) => setLongUrl(event.target.value)}
              required
            />
            <button type="submit" disabled={isShortening}>
              {isShortening ? "Creating…" : "Shorten URL"}
            </button>
          </div>
        </form>

        {createdUrl && (
          <div className="result" aria-live="polite">
            <span>Your short link</span>
            <a href={createdUrl.shortUrl} target="_blank" rel="noreferrer">
              {createdUrl.shortUrl}
            </a>
            <button className="secondary" type="button" onClick={copyShortUrl}>
              Copy
            </button>
          </div>
        )}
      </section>

      <section className="card" aria-labelledby="stats-title">
        <h2 id="stats-title">Check link statistics</h2>
        <form onSubmit={handleStats}>
          <label htmlFor="short-code">Short code or short URL</label>
          <div className="form-row">
            <input
              id="short-code"
              placeholder="e.g. 1 or http://localhost:3000/1"
              value={shortCode}
              onChange={(event) => setShortCode(event.target.value)}
              required
            />
            <button type="submit" disabled={isLoadingStats}>
              {isLoadingStats ? "Loading…" : "View stats"}
            </button>
          </div>
        </form>

        {statistics && (
          <div className="stats" aria-live="polite">
            <div className="stat">
              <span>Total clicks</span>
              <strong>{statistics.totalClicks}</strong>
            </div>
            <div className="stat">
              <span>Original URL</span>
              <a href={statistics.url.longUrl} target="_blank" rel="noreferrer">
                {statistics.url.longUrl}
              </a>
            </div>
          </div>
        )}
      </section>

      {error && <p className="error" role="alert">{error}</p>}
    </main>
  );
}

export default App;
