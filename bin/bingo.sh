#!/usr/bin/env bash
set -e

if [ -z "$1" ]; then
  echo "Usage: bingo.sh <file.wxapkg> [--out-dir <dir>] [--verbose]"
  exit 1
fi

APP="$1"
# 默认输出目录为包名
BASE="$(basename "$APP" .wxapkg)"
OUT_DIR="$BASE"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# 解析可选参数
shift
while [[ "$#" -gt 0 ]]; do
  case "$1" in
    -o|--out-dir)
      shift
      OUT_DIR="$1"
      ;;
    -v|--verbose)
      VERBOSE="--verbose"
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
  shift
done

# 运行全流程命令
node "$SCRIPT_DIR/index.js" run "$APP" -o "$OUT_DIR" $VERBOSE

echo "✔ Completed: unpack → analyze → export(md) to $OUT_DIR"