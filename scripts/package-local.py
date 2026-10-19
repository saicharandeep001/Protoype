"""Package source for local evaluation, excluding credentials and learner data."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import argparse

parser = argparse.ArgumentParser()
parser.add_argument("output", type=Path)
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
top_files = ["README.md", "LOCAL_QUICKSTART.md", "AGENTS.md", ".gitignore", ".env.example", "package.json", "package-lock.json", "next-env.d.ts", "next.config.ts", "tsconfig.json", "playwright.config.ts"]
paths = [root / name for name in top_files]
for directory in ["src", "docs", "scripts", "tests", "public"]:
    folder = root / directory
    if folder.exists():
        paths.extend(p for p in folder.rglob("*") if p.is_file() and "__pycache__" not in p.parts)
args.output.parent.mkdir(parents=True, exist_ok=True)
with ZipFile(args.output, "w", ZIP_DEFLATED) as archive:
    for path in sorted(paths):
        if path.is_symlink():
            raise RuntimeError(f"Refusing to package a symlink: {path.name}")
        archive.write(path, Path("PeduC") / path.relative_to(root))
with ZipFile(args.output) as archive:
    for name in archive.namelist():
        parts = Path(name).parts
        assert not any(p in {".data", ".git", ".next", "node_modules", "test-results"} for p in parts)
        assert not (Path(name).name.startswith(".env") and Path(name).name != ".env.example")
    assert archive.testzip() is None
    print(f"Packaged {len(archive.namelist())} source files; no databases, installed dependencies, or credentials.")
print(f"Archive: {args.output} ({args.output.stat().st_size:,} bytes)")
