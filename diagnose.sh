#!/bin/bash
# TAP plugin diagnostic: read-only, changes nothing
ok(){ echo "✅ $1"; }; bad(){ echo "❌ $1"; }; info(){ echo "ℹ️  $1"; }
VST="$HOME/Library/Audio/Plug-Ins/VST3/The Annoying Piano.vst3"
BIN="$VST/Contents/MacOS/The Annoying Piano"
LOCAL="plugin/build/TheAnnoyingPiano_artefacts/Release/VST3/The Annoying Piano.vst3"

echo "== System"
info "macOS $(sw_vers -productVersion), $(uname -m)"
ls -d /Applications/Ableton\ Live\ 12* >/dev/null 2>&1 && ok "Ableton Live 12 found" || bad "Ableton Live 12 not in /Applications"

echo "== Repo"
if git rev-parse --git-dir >/dev/null 2>&1; then
  b=$(git branch --show-current)
  [ "$b" = "claude/codebase-vst-ableton-puxbqz" ] && ok "On branch $b" || bad "On branch '$b' (expected claude/codebase-vst-ableton-puxbqz)"
  git fetch -q origin "$b" 2>/dev/null && [ "$(git rev-parse HEAD)" = "$(git rev-parse "origin/$b" 2>/dev/null)" ] && ok "Up to date with GitHub" || info "Not in sync with GitHub (run: git pull)"
  [ -f plugin/CMakeLists.txt ] && ok "plugin/ folder present" || bad "plugin/ folder missing"
else bad "Not in a git repo; cd into next-annoying-piano first"; fi

echo "== Build tools (only needed to build locally)"
xcode-select -p >/dev/null 2>&1 && ok "Xcode command line tools" || bad "No Xcode tools (run: xcode-select --install)"
command -v cmake >/dev/null && ok "$(cmake --version | head -1)" || bad "No cmake (run: brew install cmake)"
[ -d "$LOCAL" ] && ok "Local build exists" || info "No local build yet"

echo "== Installed plugin"
if [ -d "$VST" ]; then
  ok "Installed at ~/Library/Audio/Plug-Ins/VST3"
  [ -x "$BIN" ] && ok "Binary is executable" || bad "Binary missing or not executable (re-copy from the zip)"
  xattr -r "$VST" 2>/dev/null | grep -q quarantine && bad "Quarantine flag set (run: xattr -dr com.apple.quarantine \"$VST\")" || ok "No quarantine flag"
  codesign --verify --deep --strict "$VST" 2>/dev/null && ok "Signature valid" || bad "Signature invalid (run: codesign --force --deep -s - \"$VST\")"
  a=$(lipo -archs "$BIN" 2>/dev/null); [[ "$a" == *"$(uname -m)"* ]] && ok "Architectures: $a" || bad "Architectures '$a' do not include $(uname -m)"
else bad "Not installed at ~/Library/Audio/Plug-Ins/VST3"; fi
[ -d "/Library/Audio/Plug-Ins/VST3/The Annoying Piano.vst3" ] && info "Another copy in /Library/Audio/Plug-Ins/VST3 (remove one to avoid confusion)"

echo "== In Ableton, check: Settings > Plug-Ins > 'Use VST3 Plug-In System Folders' is on, then Rescan"
