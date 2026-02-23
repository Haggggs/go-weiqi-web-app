#!/bin/bash

# 阿毛专用Heartbeat Tick Interval检查脚本
# 创建时间: 2026-02-12 17:48
# 功能: 验证阿毛的heartbeat tick interval设置是否生效

set -e

echo "=== 阿毛Heartbeat Tick Interval检查 ==="
echo "检查时间: $(date)"
echo

# 配置文件路径
HEARTBEAT_CONFIG="/Users/galthran2027/.openclaw/workspace/agents/amao_workspace/heartbeat_config.json"
HEARTBEAT_FILE="/Users/galthran2027/.openclaw/workspace/agents/amao_workspace/HEARTBEAT.md"

echo "🔍 检查配置文件..."
echo

# 检查heartbeat配置文件
if [ -f "$HEARTBEAT_CONFIG" ]; then
    CONFIG_SIZE=$(wc -c < "$HEARTBEAT_CONFIG")
    CONFIG_DATE=$(stat -f %Sm "$HEARTBEAT_CONFIG")
    echo "✅ heartbeat_config.json: 存在 (${CONFIG_SIZE} bytes, ${CONFIG_DATE})"
    
    # 提取关键配置
    TICK_INTERVAL=$(grep -o '"tickInterval":[0-9]*' "$HEARTBEAT_CONFIG" | cut -d: -f2)
    CHECK_INTERVAL=$(grep -o '"checkInterval":[0-9]*' "$HEARTBEAT_CONFIG" | cut -d: -f2)
    ENABLED=$(grep -o '"enabled":true' "$HEARTBEAT_CONFIG" | wc -l)
    
    echo "📊 配置详情:"
    echo "   - tickInterval: ${TICK_INTERVAL}ms"
    echo "   - checkInterval: ${CHECK_INTERVAL}ms"
    echo "   - enabled: ${ENABLED:-'未找到'}"
else
    echo "❌ heartbeat_config.json: 不存在"
fi

echo
echo "🔍 检查HEARTBEAT.md文件..."
echo

# 检查HEARTBEAT.md文件
if [ -f "$HEARTBEAT_FILE" ]; then
    HEARTBEAT_SIZE=$(wc -c < "$HEARTBEAT_FILE")
    HEARTBEAT_DATE=$(stat -f %Sm "$HEARTBEAT_FILE")
    echo "✅ HEARTBEAT.md: 存在 (${HEARTBEAT_SIZE} bytes, ${HEARTBEAT_DATE})"
    
    # 检查关键内容
    if grep -q "阿毛专用" "$HEARTBEAT_FILE"; then
        echo "✅ 包含阿毛专用配置"
    else
        echo "⚠️ 未找到阿毛专用配置"
    fi
    
    if grep -q "T003" "$HEARTBEAT_FILE"; then
        echo "✅ 包含T003任务配置"
    else
        echo "⚠️ 未找到T003任务配置"
    fi
    
    if grep -q "每小时进度汇报" "$HEARTBEAT_FILE"; then
        echo "✅ 包含进度汇报机制"
    else
        echo "⚠️ 未找到进度汇报机制"
    fi
else
    echo "❌ HEARTBEAT.md: 不存在"
fi

echo
echo "🔍 检查Agent配置..."
echo

# 检查阿毛agent配置
AGENT_CONFIG="/Users/galthran2027/.openclaw/agents/amao/agent/auth-profiles.json"
if [ -f "$AGENT_CONFIG" ]; then
    AGENT_CONFIG_SIZE=$(wc -c < "$AGENT_CONFIG")
    AGENT_CONFIG_DATE=$(stat -f %Sm "$AGENT_CONFIG")
    echo "✅ 阿毛agent配置: 存在 (${AGENT_CONFIG_SIZE} bytes, ${AGENT_CONFIG_DATE})"
    
    # 检查heartbeat配置
    if grep -q '"heartbeat"' "$AGENT_CONFIG"; then
        echo "✅ agent配置包含heartbeat设置"
        
        # 提取具体配置
        AGENT_TICK=$(grep -o '"tickInterval":[0-9]*' "$AGENT_CONFIG" | cut -d: -f2)
        AGENT_ENABLED=$(grep -o '"enabled":true' "$AGENT_CONFIG" | wc -l)
        
        echo "   - Agent tickInterval: ${AGENT_TICK:-'未设置'}ms"
        echo "   - Agent enabled: ${AGENT_ENABLED:-'未设置'}"
    else
        echo "⚠️ agent配置缺少heartbeat设置"
    fi
else
    echo "❌ 阿毛agent配置: 不存在"
fi

echo
echo "🔍 检查系统进程..."
echo

# 检查相关进程
echo "📊 相关进程状态:"
ps aux | grep -i openclaw | grep -v grep | while read line; do
    echo "   $line"
done

echo
echo "🔍 检查端口监听..."
echo

# 检查端口
if lsof -i :18789 >/dev/null 2>&1; then
    echo "✅ OpenClaw gateway正在运行 (端口18789)"
else
    echo "❌ OpenClaw gateway未运行"
fi

echo
echo "🔍 检查Cron任务..."
echo

# 检查Cron任务
echo "📊 当前Cron任务:"
crontab -l | grep -v "^#" | grep -E "(amao|heartbeat|progress)" || echo "   未找到相关Cron任务"

echo
echo "🎯 Tick Interval设置状态总结..."
echo

# 评估设置状态
TICK_CONFIG_STATUS="❌"
CHECK_CONFIG_STATUS="❌"
HEARTBEAT_FILE_STATUS="❌"
AGENT_CONFIG_STATUS="❌"

if [ -f "$HEARTBEAT_CONFIG" ] && [ -n "$TICK_INTERVAL" ]; then
    TICK_CONFIG_STATUS="✅"
fi

if [ -f "$HEARTBEAT_CONFIG" ] && [ -n "$CHECK_INTERVAL" ]; then
    CHECK_CONFIG_STATUS="✅"
fi

if [ -f "$HEARTBEAT_FILE" ] && grep -q "阿毛专用" "$HEARTBEAT_FILE"; then
    HEARTBEAT_FILE_STATUS="✅"
fi

if [ -f "$AGENT_CONFIG" ] && grep -q '"heartbeat"' "$AGENT_CONFIG" ]; then
    AGENT_CONFIG_STATUS="✅"
fi

echo "配置状态:"
echo "   Tick Interval配置: $TICK_CONFIG_STATUS (${TICK_INTERVAL:-'未设置'})ms"
echo "   Check Interval配置: $CHECK_CONFIG_STATUS (${CHECK_INTERVAL:-'未设置'})ms"
echo "   HEARTBEAT.md文件: $HEARTBEAT_FILE_STATUS"
echo "   Agent配置: $AGENT_CONFIG_STATUS"

# 计算完整性
TOTAL=4
COMPLETE=0

[ "$TICK_CONFIG_STATUS" = "✅" ] && COMPLETE=$((COMPLETE + 1))
[ "$CHECK_CONFIG_STATUS" = "✅" ] && COMPLETE=$((COMPLETE + 1))
[ "$HEARTBEAT_FILE_STATUS" = "✅" ] && COMPLETE=$((COMPLETE + 1))
[ "$AGENT_CONFIG_STATUS" = "✅" ] && COMPLETE=$((COMPLETE + 1))

echo
echo "📊 完整性: ${COMPLETE}/${TOTAL} (${COMPLETE}*25%)"

if [ $COMPLETE -eq $TOTAL ]; then
    echo "✅ 所有关键设置已完整配置"
    echo "🎉 阿毛的tick interval应该已生效！"
    exit 0
elif [ $COMPLETE -ge 2 ]; then
    echo "⚠️ 部分配置已完成，可能需要重启服务"
    echo "建议: 重启OpenClaw服务以使新配置生效"
    exit 1
else
    echo "❌ 配置不完整，需要进一步检查"
    exit 2
fi

echo
echo "🔧 推荐的修复步骤..."
echo
echo "1. 确保所有配置文件存在且正确"
echo "2. 重启OpenClaw服务: sudo systemctl restart openclaw"
echo "3. 重新执行此脚本验证配置"
echo
echo "执行完成时间: $(date)"