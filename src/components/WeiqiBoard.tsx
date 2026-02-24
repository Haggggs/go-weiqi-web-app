import React, { useState, useRef, useEffect } from 'react'
import { generateSGF, parseSGF, downloadSGF, readLocalSGF, SGFGame } from '../utils/sgf'
import { GameLibrary, gameLibrary, GameRecord, SearchOptions } from '../utils/gameLibrary'
import { goGameSites, popularPlayers, popularEvents, SearchSuggestion } from '../utils/goGameSites'
import { players, playersByCountry, searchPlayers, getPlayerAllNames, Player } from '../utils/players'

// 规则类型定义
type RuleType = 'chinese' | 'japanese' | 'korean';

const WeiqiBoard: React.FC = () => {
  const [stones, setStones] = useState<Array<Array<'black' | 'white' | null>>>(Array(19).fill(null).map(() => Array(19).fill(null)))
  const [currentPlayer, setCurrentPlayer] = useState<'black' | 'white'>('black')
  const [capturedCount, setCapturedCount] = useState<{ black: number, white: number }>({ black: 0, white: 0 })
  const [moveNumber, setMoveNumber] = useState(0)
  const [showMoveNumber, setShowMoveNumber] = useState(true)
  const [stoneMoves, setStoneMoves] = useState<{[key: string]: number}>({})
  const [currentRule, setCurrentRule] = useState<RuleType>('chinese')
  const [handicap, setHandicap] = useState(0)
  const [gameName, setGameName] = useState(() => {
    const now = new Date()
    return `围棋对局_${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}`
  })
  const [blackPlayer, setBlackPlayer] = useState('黑方')
  const [whitePlayer, setWhitePlayer] = useState('白方')
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // 标签页状态
  const [activeTab, setActiveTab] = useState<string>('none')
  
  // 计时器状态
  const [gameTimer, setGameTimer] = useState(3600)
  const [timerRunning, setTimerRunning] = useState(false)
  
  // 标记状态
  const [markMode, setMarkMode] = useState(false)
  
  // 复盘状态
  const [reviewMode, setReviewMode] = useState(false)
  const [reviewMove, setReviewMove] = useState(0)
  const [moveHistory, setMoveHistory] = useState<Array<{row:number, col:number, color:'black'|'white', num:number}>>([])
  
  // 计时器效果
  useEffect(() => {
    if (!timerRunning || gameTimer <= 0) return
    const timer = setInterval(() => setGameTimer(t => t > 0 ? t - 1 : 0), 1000)
    return () => clearInterval(timer)
  }, [timerRunning, gameTimer])
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [showFetchDialog, setShowFetchDialog] = useState(false)
  const [showLibraryDialog, setShowLibraryDialog] = useState(false)
  const [fetchUrl, setFetchUrl] = useState('')
  const [isFetching, setIsFetching] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<GameRecord[]>([])
  const [libraryStats, setLibraryStats] = useState({ total: 0, byRules: {}, byPlayer: {}, byYear: {} })
  const [showSmartSearch, setShowSmartSearch] = useState(false)
  const [selectedSites, setSelectedSites] = useState<string[]>(goGameSites.filter(s => s.isActive).map(s => s.id))
  const [webSearchResults, setWebSearchResults] = useState<Array<{ title: string; url: string; site: string; info?: string }>>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showPlayerSelector, setShowPlayerSelector] = useState(false)
  const [playerSearch, setPlayerSearch] = useState('')
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([])
  const [playerFilter, setPlayerFilter] = useState<'all' | 'CN' | 'JP' | 'KR' | 'AI'>('all')

  // 保存为SGF棋谱（带自定义名称）
  const saveToSGF = () => {
    const moves: Array<{ row: number; col: number; color: 'black' | 'white' }> = []

    for (let row = 0; row < 19; row++) {
      for (let col = 0; col < 19; col++) {
        if (stones[row][col]) {
          moves.push({
            row,
            col,
            color: stones[row][col]!
          })
        }
      }
    }

    const komiMap: Record<RuleType, number> = {
      'chinese': 7.5,
      'japanese': 6.5,
      'korean': 6.5
    }

    const game: SGFGame = {
      gameName,
      date: new Date().toISOString().split('T')[0],
      rules: currentRule,
      komi: komiMap[currentRule],
      handicap,
      blackPlayer,
      whitePlayer,
      moves: moves.map(m => ({
        color: m.color,
        row: m.row,
        col: m.col
      }))
    }

    downloadSGF(game, `${gameName}.sgf`)
    setShowSaveDialog(false)
  }

  // 加载SGF棋谱
  const loadFromSGF = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const game = await readLocalSGF(file)

      // 设置规则
      if (game.rules) {
        setCurrentRule(game.rules)
      }

      // 设置玩家名称
      if (game.blackPlayer) setBlackPlayer(game.blackPlayer)
      if (game.whitePlayer) setWhitePlayer(game.whitePlayer)

      // 设置让子
      if (game.handicap) setHandicap(game.handicap)

      // 清空棋盘并放置棋子
      const newStones = Array(19).fill(null).map(() => Array(19).fill(null).fill(null))
      const newMoves: {[key: string]: number} = {}
      let moveNum = 0

      for (const move of game.moves) {
        if (move.row >= 0 && move.row < 19 && move.col >= 0 && move.col < 19) {
          newStones[move.row][move.col] = move.color
          moveNum++
          newMoves[`${move.row}-${move.col}`] = moveNum
        }
      }

      setStones(newStones)
      setStoneMoves(newMoves)
      setMoveNumber(moveNum)

      // 重新计算当前玩家
      if (moveNum > 0) {
        const lastMove = game.moves[game.moves.length - 1]
        setCurrentPlayer(lastMove.color === 'black' ? 'white' : 'black')
      }

      alert(`成功加载棋谱！\n规则: ${game.rules}\n手数: ${game.moves.length}`)
    } catch (error) {
      alert('加载棋谱失败，请检查文件格式')
    }

    // 清空input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // 搜索棋谱库
  const searchLibrary = () => {
    const options: SearchOptions = {}
    if (searchQuery.trim()) {
      options.query = searchQuery
    }
    const results = gameLibrary.search(options)
    setSearchResults(results)
    setLibraryStats(gameLibrary.getStats())
  }

  // 选择棋手
  const selectPlayer = (player: Player) => {
    if (!selectedPlayers.find(p => p.id === player.id)) {
      setSelectedPlayers([...selectedPlayers, player])
      // 自动搜索该棋手的所有名字
      const allNames = getPlayerAllNames(player).join(' ')
      if (!searchQuery.includes(allNames)) {
        setSearchQuery(searchQuery ? `${searchQuery} ${allNames}` : allNames)
      }
    }
    setShowPlayerSelector(false)
    setPlayerSearch('')
  }

  // 移除已选棋手
  const removePlayer = (playerId: string) => {
    setSelectedPlayers(selectedPlayers.filter(p => p.id !== playerId))
  }

  // 智能搜索棋谱（从选中的网站搜索）
  const smartSearch = async () => {
    if (!searchQuery.trim()) {
      alert('请输入搜索关键词')
      return
    }

    setIsSearching(true)
    setWebSearchResults([])
    
    // 模拟搜索延迟
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const results: Array<{ title: string; url: string; site: string; info?: string }> = []
    const selected = goGameSites.filter(s => selectedSites.includes(s.id))

    // 为每个选中的网站生成搜索链接
    for (const site of selected) {
      const searchUrl = site.searchUrl.replace('{query}', encodeURIComponent(searchQuery))
      results.push({
        title: `${searchQuery} - ${site.nameCN} (${site.gameCount})`,
        url: searchUrl,
        site: site.nameCN,
        info: `${site.features.slice(0, 2).join('、')}`
      })
    }

    setWebSearchResults(results)
    setIsSearching(false)
  }

  // 打开搜索链接（现在直接在浏览器中打开）
  const openResult = (result: { title: string; url: string; site: string }) => {
    window.open(result.url, '_blank')
  }

  // 批量打开选中结果（在浏览器中打开）
  const batchOpen = () => {
    const selected = webSearchResults.filter((_, i) => selectedResults.includes(i))
    if (selected.length === 0) {
      alert('请选择要打开的棋谱网站')
      return
    }

    // 依次在浏览器中打开
    for (const result of selected) {
      window.open(result.url, '_blank')
    }

    alert(`已打开 ${selected.length} 个网站，请在网站中手动搜索和下载棋谱`)
    setShowSmartSearch(false)
  }

  const [selectedResults, setSelectedResults] = useState<number[]>([])

  // 批量抓取（示例）
  const batchFetch = async (urls: string[]) => {
    const results: GameRecord[] = []
    const corsProxy = 'https://api.allorigins.win/raw?url='

    for (const url of urls) {
      try {
        const response = await fetch(corsProxy + encodeURIComponent(url))
        const content = await response.text()

        // 尝试提取SGF
        const sgfMatch = content.match(/\([\s\S]*?\)/)
        if (sgfMatch) {
          const game = parseSGF(sgfMatch[0])
          if (game.moves.length > 0) {
            // 检查是否重复
            const duplicate = gameLibrary.findDuplicate({
              id: '',
              gameName: game.gameName || 'Unknown',
              date: game.date || new Date().toISOString().split('T')[0],
              rules: game.rules || 'chinese',
              komi: game.komi || 7.5,
              handicap: game.handicap || 0,
              blackPlayer: game.blackPlayer || 'Unknown',
              whitePlayer: game.whitePlayer || 'Unknown',
              moves: game.moves.map(m => ({ row: m.row, col: m.col, color: m.color })),
              source: url,
              sourceUrl: url,
              downloadedAt: new Date().toISOString()
            })

            if (!duplicate) {
              results.push({
                id: '',
                gameName: game.gameName || 'Unknown',
                date: game.date || new Date().toISOString().split('T')[0],
                rules: game.rules || 'chinese',
                komi: game.komi || 7.5,
                handicap: game.handicap || 0,
                blackPlayer: game.blackPlayer || 'Unknown',
                whitePlayer: game.whitePlayer || 'Unknown',
                moves: game.moves.map(m => ({ row: m.row, col: m.col, color: m.color })),
                source: url,
                sourceUrl: url,
                downloadedAt: new Date().toISOString()
              })
            }
          }
        }
      } catch (e) {
        console.error('Failed to fetch:', url, e)
      }
    }

    if (results.length > 0) {
      gameLibrary.addGames(results)
      alert(`成功批量抓取 ${results.length} 局棋谱！`)
      searchLibrary()
    }
  }

  // 从URL抓取SGF棋谱
  const fetchFromUrl = async () => {
    if (!fetchUrl.trim()) {
      alert('请输入有效的URL地址')
      return
    }

    setIsFetching(true)

    try {
      // 使用CORS代理来获取内容
      const corsProxy = 'https://api.allorigins.win/raw?url='
      const response = await fetch(corsProxy + encodeURIComponent(fetchUrl))

      if (!response.ok) {
        throw new Error('网络请求失败')
      }

      const content = await response.text()

      // 尝试提取SGF内容
      const sgfMatch = content.match(/\([\s\S]*?\)/)
      if (!sgfMatch) {
        // 尝试作为文件下载
        const blob = new Blob([content], { type: 'text/plain' })
        const file = new File([blob], 'fetched.sgf', { type: 'text/plain' })

        // 使用readLocalSGF解析
        const game = await readLocalSGF(file)

        // 设置规则
        if (game.rules) setCurrentRule(game.rules)
        if (game.blackPlayer) setBlackPlayer(game.blackPlayer)
        if (game.whitePlayer) setWhitePlayer(game.whitePlayer)
        if (game.handicap) setHandicap(game.handicap)

        // 清空棋盘并放置棋子
        const newStones = Array(19).fill(null).map(() => Array(19).fill(null).fill(null))
        const newMoves: {[key: string]: number} = {}
        let moveNum = 0

        for (const move of game.moves) {
          if (move.row >= 0 && move.row < 19 && move.col >= 0 && move.col < 19) {
            newStones[move.row][move.col] = move.color
            moveNum++
            newMoves[`${move.row}-${move.col}`] = moveNum
          }
        }

        setStones(newStones)
        setStoneMoves(newMoves)
        setMoveNumber(moveNum)

        if (moveNum > 0) {
          const lastMove = game.moves[game.moves.length - 1]
          setCurrentPlayer(lastMove.color === 'black' ? 'white' : 'black')
        }

        alert(`成功从网络抓取棋谱！\n规则: ${game.rules}\n手数: ${game.moves.length}`)
      } else {
        alert('未能从网页中提取到SGF棋谱')
      }
    } catch (error) {
      alert('抓取失败，请检查URL是否正确')
    } finally {
      setIsFetching(false)
      setShowFetchDialog(false)
    }
  }

  // SGF规则标签映射
  const sgfRuleMap: {[key: string]: RuleType} = {
    'chinese': 'chinese',
    'japanese': 'japanese',
    'korean': 'korean',
    'jp': 'japanese',
    'kr': 'korean'
  }

  // 解析SGF棋谱并自动设置规则
  const parseSGF = (sgfContent: string): any => {
    // 查找规则标签
    let detectedRule: RuleType = 'chinese' // 默认中国规则

    // 尝试从SGF中提取规则
    const ruleMatch = sgfContent.match(/RU\[(\w+)\]/i)
    if (ruleMatch && ruleMatch[1]) {
      const rule = ruleMatch[1].toLowerCase()
      if (sgfRuleMap[rule]) {
        detectedRule = sgfRuleMap[rule]
      }
    }

    // 解析每一步棋
    const moves: Array<{row: number, col: number, color: 'black' | 'white'}> = []
    const moveMatches = sgfContent.matchAll(/(B|W)\[([a-s][a-s])\]/gi)
    for (const match of moveMatches) {
      const color = match[1].toUpperCase() === 'B' ? 'black' : 'white'
      const col = match[2].charCodeAt(0) - 97 // a-s = 0-18
      const row = match[2].charCodeAt(1) - 97
      if (row >= 0 && row < 19 && col >= 0 && col < 19) {
        moves.push({ row, col, color })
      }
    }

    return { rule: detectedRule, moves, gameName: '', date: '', rules: detectedRule, komi: 7.5, handicap: 0, blackPlayer: '', whitePlayer: '' }
  }

  // 计算棋子的气数
  const countLiberties = (board: Array<Array<'black' | 'white' | null>>, row: number, col: number, color: 'black' | 'white'): number => {
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]
    let liberties = 0
    const visited = new Set<string>()

    const checkGroup = (r: number, c: number): void => {
      if (r < 0 || r >= 19 || c < 0 || c >= 19) return
      if (board[r][c] !== color) return
      const key = `${r}-${c}`
      if (visited.has(key)) return
      visited.add(key)

      directions.forEach(([dr, dc]) => {
        const newR = r + dr
        const newC = c + dc
        if (newR >= 0 && newR < 19 && newC >= 0 && newC < 19) {
          if (board[newR][newC] === null) {
            liberties++
          } else if (board[newR][newC] === color) {
            checkGroup(newR, newC)
          }
        }
      })
    }

    checkGroup(row, col)
    return liberties
  }

  // 提子功能
  
  
  const generateSGFFromState = (): string => {
    const moves: Array<{ row: number; col: number; color: 'black' | 'white' }> = []
    for (let row = 0; row < 19; row++) {
      for (let col = 0; col < 19; col++) {
        if (stones[row][col]) {
          moves.push({ row, col, color: stones[row][col]! })
        }
      }
    }
    const komi = currentRule === 'chinese' ? 7.5 : 6.5
    const game = { gameName, date: new Date().toISOString().split('T')[0], rules: currentRule, komi, handicap, blackPlayer, whitePlayer, moves }
    return generateSGF(game)
  }

  // 复盘功能
  const goToReviewMove = (moveNum: number) => {
    if (moveNum < 0 || moveNum > moveHistory.length) return
    const tempBoard = Array(19).fill(null).map(() => Array(19).fill(null))
    for (let i = 0; i < moveNum && i < moveHistory.length; i++) {
      const m = moveHistory[i]
      if (m.row >= 0 && m.row < 19 && m.col >= 0 && m.col < 19) {
        tempBoard[m.row][m.col] = m.color
      }
    }
    setStones(tempBoard)
    setReviewMove(moveNum)
    const tempMoves: {[key: string]: number} = {}
    for (let i = 0; i < moveNum; i++) {
      const m = moveHistory[i]
      tempMoves[`${m.row}-${m.col}`] = i + 1
    }
    setStoneMoves(tempMoves)
    setMoveNumber(moveNum)
  }

const handlePlaceStone = (row: number, col: number) => {
    if (stones[row][col] === null) {
      // 创建新的棋盘状态
      const newStones = stones.map(row => [...row])
      newStones[row][col] = currentPlayer

      const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]
      const opponent = currentPlayer === 'black' ? 'white' : 'black'
      let captured = false
      let totalCaptured = 0

      // 检查每个方向的敌方棋子，如果气数为0则提子
      directions.forEach(([dr, dc]) => {
        const newRow = row + dr
        const newCol = col + dc
        if (newRow >= 0 && newRow < 19 && newCol >= 0 && newCol < 19) {
          if (newStones[newRow][newCol] === opponent) {
            const liberties = countLiberties(newStones, newRow, newCol, opponent)
            if (liberties === 0) {
              // 提掉这个棋子群
              const removeGroup = (r: number, c: number): number => {
                if (r < 0 || r >= 19 || c < 0 || c >= 19) return 0
                if (newStones[r][c] !== opponent) return 0
                newStones[r][c] = null
                let count = 1
                directions.forEach(([dr2, dc2]) => {
                  count += removeGroup(r + dr2, c + dc2)
                })
                return count
              }
              const removedCount = removeGroup(newRow, newCol)
              totalCaptured += removedCount
              captured = true
            }
          }
        }
      })

      setStones(newStones)
      if (totalCaptured > 0) {
        setCapturedCount(prev => ({
          ...prev,
          [currentPlayer]: prev[currentPlayer] + totalCaptured
        }))
      }
      // 更新手数
      const newMoveNumber = moveNumber + 1
      setMoveNumber(newMoveNumber)
      setStoneMoves(prev => ({
        ...prev,
        [`${row}-${col}`]: newMoveNumber
      }))
      // 记录到历史
      setMoveHistory(prev => [...prev, { row, col, color: currentPlayer, num: newMoveNumber }])
      setCurrentPlayer(currentPlayer === 'black' ? 'white' : 'black')
    }
  }

  const cellSize = 30
  const boardSizePixels = cellSize * (19 - 1)  // 19×19棋盘只有18个间隔
  const margin = 30

  return (
    <div className="weiqi-board-container flex gap-4">
      {/* 左侧边栏 - 对局信息 */}
      <div className="w-48 bg-white p-4 rounded-lg shadow-lg">
        <h3 className="text-lg font-bold mb-4 border-b pb-2">📋 对局信息</h3>

        <div className="space-y-3">
          {/* 比赛名称 */}
          <div>
            <label className="text-xs text-gray-500">比赛名称</label>
            <input
              type="text"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              className="w-full px-2 py-1 border rounded text-sm"
            />
          </div>

          {/* 黑方信息 */}
          <div className="bg-gray-50 p-2 rounded">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-black rounded-full"></span>
              <span className="font-bold text-sm">黑方</span>
            </div>
            <input
              type="text"
              value={blackPlayer}
              onChange={(e) => setBlackPlayer(e.target.value)}
              className="w-full px-2 py-1 border rounded text-sm mt-1"
              placeholder="黑方名称"
            />
          </div>

          {/* 白方信息 */}
          <div className="bg-gray-50 p-2 rounded">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-white border rounded-full"></span>
              <span className="font-bold text-sm">白方</span>
            </div>
            <input
              type="text"
              value={whitePlayer}
              onChange={(e) => setWhitePlayer(e.target.value)}
              className="w-full px-2 py-1 border rounded text-sm mt-1"
              placeholder="白方名称"
            />
          </div>

          {/* 规则选择 */}
          <div>
            <label className="text-xs text-gray-500">规则</label>
            <select
              value={currentRule}
              onChange={(e) => setCurrentRule(e.target.value as RuleType)}
              className="w-full px-2 py-1 border rounded text-sm"
            >
              <option value="chinese">中国规则 (7.5目)</option>
              <option value="japanese">日本规则 (6.5目)</option>
              <option value="korean">韩国规则 (6.5目)</option>
            </select>
          </div>

          {/* 日期 */}
          <div>
            <label className="text-xs text-gray-500">日期</label>
            <input
              type="date"
              value={new Date().toISOString().split('T')[0]}
              className="w-full px-2 py-1 border rounded text-sm"
              readOnly
            />
          </div>
        </div>
      </div>

      {/* 中间棋盘 */}
      <div className="relative bg-amber-100 p-6 rounded-lg shadow-lg">
        <svg
          width={boardSizePixels + 2 * margin}
          height={boardSizePixels + 2 * margin + 40}
          viewBox={`0 0 ${boardSizePixels + 2 * margin} ${boardSizePixels + 2 * margin + 40}`}
        >
          {/* 棋盘背景 */}
          <rect
            x={margin}
            y={margin}
            width={boardSizePixels}
            height={boardSizePixels}
            fill="#deb887"
          />

          {/* 网格线 */}
          {Array(19).fill(null).map((_, i) => (
            <>
              <line
                key={`v-${i}`}
                x1={margin + i * cellSize}
                y1={margin}
                x2={margin + i * cellSize}
                y2={margin + 18 * cellSize}
                stroke="#8b7355"
                strokeWidth="1"
              />
              <line
                key={`h-${i}`}
                x1={margin}
                y1={margin + i * cellSize}
                x2={margin + 18 * cellSize}
                y2={margin + i * cellSize}
                stroke="#8b7355"
                strokeWidth="1"
              />
            </>
          ))}

          {/* 星位 */}
          {[[3, 3], [3, 9], [3, 15], [9, 3], [9, 9], [9, 15], [15, 3], [15, 9], [15, 15]].map(([row, col]) => (
            <circle
              key={`star-${row}-${col}`}
              cx={margin + col * cellSize}
              cy={margin + row * cellSize}
              r={3}
              fill="#8b7355"
            />
          ))}

          {/* 坐标 - 修复乱码问题 */}
          {/* 左侧行坐标 1-19 */}
          {Array(19).fill(null).map((_, i) => (
            <text
              key={`coord-row-${i}`}
              x={margin - 15}
              y={margin + i * cellSize + 5}
              fontSize="12"
              fill="#666"
              textAnchor="end"
            >
              {String(19 - i)}
            </text>
          ))}

          {/* 底部列坐标 A-T - 修复乱码问题 */}
          {Array(19).fill(null).map((_, i) => {
            const letters = 'ABCDEFGHJKLMNPQRST'
            return (
              <text
                key={`coord-col-${i}`}
                x={margin + i * cellSize}
                y={margin + 18 * cellSize + 25}
                fontSize="12"
                fill="#666"
                textAnchor="middle"
              >
                {letters[i]}
              </text>
            )
          })}
        </svg>

        {moveHistory.length > 0 && (
          <div className="flex items-center justify-center gap-1 mt-2 px-2 py-1 bg-white rounded shadow">
            <button onClick={()=>goToReviewMove(0)} disabled={reviewMove===0} className="px-2 py-1 bg-gray-200 rounded text-sm disabled:opacity-50" title="第一步">⏮</button>
            <button onClick={()=>goToReviewMove(reviewMove-1)} disabled={reviewMove===0} className="px-2 py-1 bg-gray-200 rounded text-sm disabled:opacity-50" title="上一步">◀</button>
            <span className="text-xs px-2">{reviewMove}/{moveHistory.length}</span>
            <button onClick={()=>goToReviewMove(reviewMove+1)} disabled={reviewMove>=moveHistory.length} className="px-2 py-1 bg-gray-200 rounded text-sm disabled:opacity-50" title="下一步">▶</button>
            <button onClick={()=>goToReviewMove(moveHistory.length)} disabled={reviewMove>=moveHistory.length} className="px-2 py-1 bg-gray-200 rounded text-sm disabled:opacity-50" title="最后一步">⏭</button>
          </div>
        )}

        {/* 棋子层 - 修复位置偏移，继续向左上调整 */}
        <div className="absolute" style={{ left: margin, top: margin, width: boardSizePixels, height: boardSizePixels }}>
          {stones.map((row, rowIndex) =>
            row.map((stone, colIndex) => {
              if (stone) {
                const stoneSize = cellSize * 0.85
                // 继续向左上调整
                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className="absolute flex items-center justify-center"
                    style={{
                      // 进一步向左上调整
                      left: margin + colIndex * cellSize - cellSize / 2,
                      top: margin + rowIndex * cellSize - cellSize / 2,
                      width: stoneSize,
                      height: stoneSize,
                    }}
                  >
                    <div className={`w-full h-full rounded-full flex items-center justify-center ${
                      stone === 'black' ? 'bg-black' : 'bg-white border border-gray-300'
                    }`}>
                      {showMoveNumber && stoneMoves[`${rowIndex}-${colIndex}`] && (
                        <span className={`text-xs font-bold ${stone === 'black' ? 'text-white' : 'text-black'}`}>
                          {stoneMoves[`${rowIndex}-${colIndex}`]}
                        </span>
                      )}
                    </div>
                  </div>
                )
              }
              return null
            })
          )}
        </div>

        {/* 点击层 - 修复位置偏移，继续向左上调整 */}
        <div
          className="absolute"
          style={{
            left: margin,
            top: margin,
            width: boardSizePixels,
            height: boardSizePixels,
          }}
        >
          {Array(19).fill(null).map((_, rowIndex) =>
            Array(19).fill(null).map((_, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="absolute cursor-crosshair hover:bg-yellow-300 hover:rounded-full transition-all duration-150 opacity-40 hover:opacity-80"
                style={{
                  // 进一步向左上调整
                  left: margin + colIndex * cellSize - cellSize / 2,
                  top: margin + rowIndex * cellSize - cellSize / 2,
                  width: cellSize,
                  height: cellSize,
                  borderRadius: '50%',
                }}
                onClick={() => handlePlaceStone(rowIndex, colIndex)}
              />
            ))
          )}
        </div>
      </div>

      {/* 右侧边栏 - 控制面板 */}
      <div className="w-56 bg-white p-4 rounded-lg shadow-lg">
        <h3 className="text-lg font-bold mb-4 border-b pb-2">🎮 控制面板</h3>

        <div className="space-y-3">
          {/* 当前回合 */}
          <div className="text-center p-3 bg-gray-50 rounded">
            <p className="text-xs text-gray-500">当前回合</p>
            <p className={`text-xl font-bold ${currentPlayer === 'black' ? 'text-black' : 'text-gray-600'}`}>
              {currentPlayer === 'black' ? '⚫ 黑棋' : '⚪ 白棋'}
            </p>
          </div>

          {/* 手数 */}
          <div className="text-center p-3 bg-gray-50 rounded">
            <p className="text-xs text-gray-500">当前手数</p>
            <p className="text-2xl font-bold">{moveNumber}</p>
          </div>

          {/* 提子统计 */}
          <div className="flex justify-between text-center p-3 bg-gray-50 rounded">
            <div>
              <p className="text-xs text-gray-500">⚫ 提子</p>
              <p className="text-lg font-bold">{capturedCount.black}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">⚪ 提子</p>
              <p className="text-lg font-bold">{capturedCount.white}</p>
            </div>
          </div>

          {/* 规则和贴目 */}
          <div className="p-3 bg-gray-50 rounded text-sm">
            <p><span className="text-gray-500">规则:</span> <span className="font-bold">{currentRule === 'chinese' ? '中国' : currentRule === 'japanese' ? '日本' : '韩国'}</span></p>
            <p><span className="text-gray-500">贴目:</span> <span className="font-bold">{currentRule === 'chinese' ? '7.5' : '6.5'}目</span></p>
          </div>

          {/* 操作按钮 */}
          <div className="space-y-2">
            <button
              onClick={() => setShowMoveNumber(!showMoveNumber)}
              className={`w-full px-3 py-2 rounded text-sm ${showMoveNumber ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            >
              {showMoveNumber ? '✓ 显示手数' : '○ 隐藏手数'}
            </button>

            <button
              onClick={() => {
                setStones(Array(19).fill(null).map(() => Array(19).fill(null)))
                setCurrentPlayer('black')
                setCapturedCount({ black: 0, white: 0 })
                setMoveNumber(0)
                setStoneMoves({})
              }}
              className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
              🔄 重新开始
            </button>
          </div>
        </div>
      </div>
      {/* SGF棋谱区域 */}
      <div className="mt-4 p-3 bg-gray-100 rounded">
        <p className="text-sm font-bold mb-2">📂 SGF棋谱管理</p>

        <div className="flex flex-wrap gap-2 mb-3">
          <button
            onClick={() => setShowSaveDialog(true)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm"
          >
            💾 保存棋谱
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
          >
            📂 打开棋谱
          </button>

          <button
            onClick={() => { setShowLibraryDialog(true); searchLibrary(); }}
            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors text-sm"
          >
            📚 棋谱库
          </button>
          
          <button
            onClick={() => setShowSmartSearch(true)}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded hover:from-purple-600 hover:to-pink-600 transition-colors text-sm"
          >
            🔍 智能搜索
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".sgf"
            onChange={loadFromSGF}
            className="hidden"
          />
        </div>

        {/* 抓取对话框 */}
        {showFetchDialog && (
          <div className="mt-3 p-3 bg-white rounded border">
            <p className="text-sm font-bold mb-2">🌐 从网络抓取棋谱</p>

            <div className="space-y-2">
              <div>
                <label className="text-xs text-gray-600">棋谱URL地址:</label>
                <input
                  type="url"
                  value={fetchUrl}
                  onChange={(e) => setFetchUrl(e.target.value)}
                  className="w-full px-2 py-1 border rounded text-sm"
                  placeholder="输入SGF文件或网页的URL"
                />
              </div>

              <p className="text-xs text-gray-500">
                📌 支持从以下来源抓取：<br/>
                • SGF文件直接链接<br/>
                • 围棋棋谱网站页面
              </p>
            </div>

            <div className="flex gap-2 mt-3">
              <button
                onClick={fetchFromUrl}
                disabled={isFetching}
                className={`px-4 py-2 rounded text-sm ${isFetching ? 'bg-gray-400' : 'bg-purple-500 hover:bg-purple-600 text-white'}`}
              >
                {isFetching ? '⏳ 抓取中...' : '🔍 确认抓取'}
              </button>
              <button
                onClick={() => setShowFetchDialog(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-sm"
              >
                ❌ 取消
              </button>
            </div>
          </div>
        )}

        {/* 保存对话框 */}
        {showSaveDialog && (
          <div className="mt-3 p-3 bg-white rounded border">
            <p className="text-sm font-bold mb-2">💾 保存棋谱设置</p>

            <div className="space-y-2">
              <div>
                <label className="text-xs text-gray-600">文件名:</label>
                <input
                  type="text"
                  value={gameName}
                  onChange={(e) => setGameName(e.target.value)}
                  className="w-full px-2 py-1 border rounded text-sm"
                  placeholder="输入文件名"
                />
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={blackPlayer}
                  onChange={(e) => setBlackPlayer(e.target.value)}
                  className="flex-1 px-2 py-1 border rounded text-sm"
                  placeholder="黑方名称"
                />
                <input
                  type="text"
                  value={whitePlayer}
                  onChange={(e) => setWhitePlayer(e.target.value)}
                  className="flex-1 px-2 py-1 border rounded text-sm"
                  placeholder="白方名称"
                />
              </div>

              <p className="text-xs text-gray-500">
                📁 默认保存位置: 下载文件夹<br/>
                📅 默认格式: 围棋对局_YYYYMMDD.sgf
              </p>
            </div>

            <div className="flex gap-2 mt-3">
              <button
                onClick={saveToSGF}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
              >
                ✅ 确认保存
              </button>
              <button
                onClick={() => setShowSaveDialog(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-sm"
              >
                ❌ 取消
              </button>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1 mt-2">
          <p>📌 保存：对局将保存为SGF格式，可分享给他人</p>
          <p>📌 打开：支持中国/日本/韩国规则自动识别</p>
        </div>
      </div>

      {/* 智能搜索对话框 */}
      {showSmartSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <h3 className="text-lg font-bold">🔍 智能棋谱搜索</h3>
              <button onClick={() => setShowSmartSearch(false)} className="text-white hover:text-gray-200">✕</button>
            </div>
            
            <div className="p-4 overflow-y-auto max-h-[75vh]">
              {/* 搜索输入 */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && smartSearch()}
                  placeholder="输入棋手名、比赛名、日期..."
                  className="flex-1 px-4 py-3 border rounded-lg text-lg"
                />
                <button
                  onClick={smartSearch}
                  disabled={isSearching}
                  className={`px-6 py-3 rounded-lg font-bold ${isSearching ? 'bg-gray-400' : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90'}`}
                >
                  {isSearching ? '⏳ 搜索中...' : '🔍 搜索'}
                </button>
              </div>
              
              {/* 已选棋手 */}
              {selectedPlayers.length > 0 && (
                <div className="mb-4 p-3 bg-purple-50 rounded border border-purple-200">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-bold">🎯 已选棋手:</p>
                    <button onClick={() => setSelectedPlayers([])} className="text-xs text-gray-500">清除全部</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedPlayers.map(p => (
                      <span key={p.id} className="px-2 py-1 bg-white rounded-full text-sm flex items-center gap-1">
                        {p.nameCN}
                        <button onClick={() => removePlayer(p.id)} className="text-gray-400 hover:text-red-500">×</button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* 棋手选择器按钮 */}
              <div className="mb-4">
                <button
                  onClick={() => setShowPlayerSelector(!showPlayerSelector)}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-bold hover:opacity-90"
                >
                  🎯 选择棋手 (中日韩统一名录)
                </button>
                
                {/* 棋手选择器面板 */}
                {showPlayerSelector && (
                  <div className="mt-2 p-3 bg-gray-50 rounded border max-h-64 overflow-y-auto">
                    {/* 搜索框 */}
                    <input
                      type="text"
                      value={playerSearch}
                      onChange={(e) => setPlayerSearch(e.target.value)}
                      placeholder="输入名字搜索..."
                      className="w-full px-3 py-2 border rounded mb-2"
                    />
                    
                    {/* 国家筛选 */}
                    <div className="flex gap-2 mb-2">
                      {(['all', 'CN', 'JP', 'KR', 'AI'] as const).map(f => (
                        <button
                          key={f}
                          onClick={() => setPlayerFilter(f)}
                          className={`px-2 py-1 rounded text-xs ${playerFilter === f ? 'bg-purple-500 text-white' : 'bg-white border'}`}
                        >
                          {f === 'all' ? '全部' : f === 'CN' ? '中国' : f === 'JP' ? '日本' : f === 'KR' ? '韩国' : 'AI'}
                        </button>
                      ))}
                    </div>
                    
                    {/* 棋手列表 */}
                    <div className="grid grid-cols-2 gap-1 max-h-40 overflow-y-auto">
                      {players
                        .filter(p => playerFilter === 'all' || p.country === playerFilter || (playerFilter === 'AI' && p.rank === 'AI'))
                        .filter(p => !playerSearch || searchPlayers(playerSearch).some(sp => sp.id === p.id))
                        .slice(0, 20)
                        .map(p => (
                          <button
                            key={p.id}
                            onClick={() => selectPlayer(p)}
                            className="text-left px-2 py-1 hover:bg-purple-100 rounded text-sm"
                          >
                            <span className="font-bold">{p.nameCN}</span>
                            <span className="text-xs text-gray-500"> {p.nameEN}</span>
                          </button>
                        ))
                      }
                    </div>
                  </div>
                )}
              </div>
              
              {/* 快速建议 */}
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">💡 热门棋手:</p>
                <div className="flex flex-wrap gap-2">
                  {['柯洁', '申真谞', '井山裕太', '朴廷桓', '芈昱廷', '卞相壹'].map(player => (
                    <button
                      key={player}
                      onClick={() => {
                        const p = players.find(pl => pl.nameCN === player)
                        if (p) selectPlayer(p)
                      }}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200"
                    >
                      {player}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* 网站选择 */}
              <div className="mb-4 p-3 bg-gray-50 rounded">
                <p className="text-sm font-bold mb-2">🌐 选择搜索网站 (共{goGameSites.filter(s => s.isActive).length}个):</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                  {goGameSites.filter(s => s.isActive).map(site => (
                    <label
                      key={site.id}
                      className={`flex items-start gap-2 px-3 py-2 rounded cursor-pointer ${selectedSites.includes(site.id) ? 'bg-purple-100 border-purple-500' : 'bg-white border'}`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedSites.includes(site.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSites([...selectedSites, site.id])
                          } else {
                            setSelectedSites(selectedSites.filter(id => id !== site.id))
                          }
                        }}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="font-bold text-sm">{site.nameCN}</div>
                        <div className="text-xs text-gray-500">{site.gameCount}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* 搜索结果 */}
              {webSearchResults.length > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-bold">📋 搜索结果 ({webSearchResults.length})</p>
                    <button
                      onClick={batchOpen}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      📥 批量下载选中
                    </button>
                  </div>
                  
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {webSearchResults.map((result, idx) => (
                      <div key={idx} className={`border rounded p-3 flex items-center gap-3 ${selectedResults.includes(idx) ? 'bg-purple-50 border-purple-500' : 'hover:bg-gray-50'}`}>
                        <input
                          type="checkbox"
                          checked={selectedResults.includes(idx)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedResults([...selectedResults, idx])
                            } else {
                              setSelectedResults(selectedResults.filter(i => i !== idx))
                            }
                          }}
                          className="w-5 h-5"
                        />
                        <div className="flex-1">
                          <div className="font-bold">{result.title}</div>
                          <div className="text-sm text-gray-500">
                            🏢 {result.site} | {result.info}
                          </div>
                        </div>
                        <button
                          onClick={() => window.open(result.url, '_blank')}
                          className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                          title="在浏览器中打开"
                        >
                          🔗
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {webSearchResults.length === 0 && !isSearching && (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-4xl mb-4">🔍</p>
                  <p>输入关键词开始搜索棋谱</p>
                  <p className="text-sm mt-2">选择网站后点击搜索</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 棋谱库对话框 */}
      {showLibraryDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-bold">📚 棋谱库管理</h3>
              <button onClick={() => setShowLibraryDialog(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>

            <div className="p-4 overflow-y-auto max-h-[60vh]">
              {/* 搜索框 */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchLibrary()}
                  placeholder="搜索棋手、比赛、日期..."
                  className="flex-1 px-3 py-2 border rounded"
                />
                <button
                  onClick={searchLibrary}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  🔍 搜索
                </button>
              </div>

              {/* 统计信息 */}
              <div className="grid grid-cols-4 gap-2 mb-4 text-center">
                <div className="bg-gray-100 rounded p-2">
                  <div className="text-2xl font-bold">{libraryStats.total}</div>
                  <div className="text-xs text-gray-500">总棋谱</div>
                </div>
                <div className="bg-green-100 rounded p-2">
                  <div className="text-2xl font-bold">{libraryStats.byRules['chinese'] || 0}</div>
                  <div className="text-xs text-gray-500">中国规则</div>
                </div>
                <div className="bg-blue-100 rounded p-2">
                  <div className="text-2xl font-bold">{libraryStats.byRules['japanese'] || 0}</div>
                  <div className="text-xs text-gray-500">日本规则</div>
                </div>
                <div className="bg-purple-100 rounded p-2">
                  <div className="text-2xl font-bold">{libraryStats.byRules['korean'] || 0}</div>
                  <div className="text-xs text-gray-500">韩国规则</div>
                </div>
              </div>

              {/* 搜索结果 */}
              <div className="space-y-2">
                {searchResults.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">暂无棋谱，请搜索或批量抓取</p>
                ) : (
                  searchResults.map((game, idx) => (
                    <div key={idx} className="border rounded p-2 hover:bg-gray-50">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-bold">{game.blackPlayer} vs {game.whitePlayer}</div>
                          <div className="text-sm text-gray-500">
                            {game.date} | {game.rules === 'chinese' ? '中国规则' : game.rules === 'japanese' ? '日本规则' : '韩国规则'} | {game.moves.length}手
                          </div>
                          {game.event && <div className="text-sm text-gray-500">🏆 {game.event}</div>}
                        </div>
                        <button
                          onClick={() => {
                            // 加载到棋盘
                            const newStones = Array(19).fill(null).map(() => Array(19).fill(null).fill(null))
                            const newMoves: {[key: string]: number} = {}
                            let moveNum = 0
                            for (const move of game.moves) {
                              if (move.row >= 0 && move.row < 19 && move.col >= 0 && move.col < 19) {
                                newStones[move.row][move.col] = move.color
                                moveNum++
                                newMoves[`${move.row}-${move.col}`] = moveNum
                              }
                            }
                            setStones(newStones)
                            setStoneMoves(newMoves)
                            setMoveNumber(moveNum)
                            setCurrentRule(game.rules)
                            setGameName(game.gameName || '加载棋谱')
                            setBlackPlayer(game.blackPlayer)
                            setWhitePlayer(game.whitePlayer)
                            setShowLibraryDialog(false)
                          }}
                          className="px-3 py-1 bg-green-500 text-white rounded text-sm"
                        >
                          加载
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      
      {/* 底部标签页 */}
      <div className="mt-4">
        <div className="flex gap-1 mb-2 flex-wrap justify-center">
          <button onClick={()=>setActiveTab(activeTab==='timer'?'none':'timer')} className={`px-3 py-1 rounded text-sm ${activeTab==='timer'?'bg-blue-500 text-white':'bg-gray-200'}`}>⏱️ 计时</button>
          <button onClick={()=>setActiveTab(activeTab==='review'?'none':'review')} className={`px-3 py-1 rounded text-sm ${activeTab==='review'?'bg-blue-500 text-white':'bg-gray-200'}`}>📻 复盘</button>
          <button onClick={()=>setActiveTab(activeTab==='mark'?'none':'mark')} className={`px-3 py-1 rounded text-sm ${activeTab==='mark'?'bg-blue-500 text-white':'bg-gray-200'}`}>🎯 标记</button>
          <button onClick={()=>setActiveTab(activeTab==='sgf'?'none':'sgf')} className={`px-3 py-1 rounded text-sm ${activeTab==='sgf'?'bg-blue-500 text-white':'bg-gray-200'}`}>📂 棋谱</button>
        </div>
        
        {activeTab !== 'none' && (
          <div className="bg-white rounded-lg shadow p-4">
            {activeTab === 'timer' && (
              <div className="text-center">
                <div className="text-4xl font-bold mb-3" style={{color: gameTimer < 300 ? '#ef4444' : '#1f2937'}}>{Math.floor(gameTimer/60)}:{String(gameTimer%60).padStart(2,'0')}</div>
                <div className="flex justify-center gap-2">
                  <button onClick={()=>setTimerRunning(!timerRunning)} className={`px-4 py-2 rounded font-bold ${timerRunning?'bg-yellow-500':'bg-green-500'} text-white`}>{timerRunning?'⏸️ 暂停':'▶️ 开始'}</button>
                  <button onClick={()=>{setGameTimer(3600); setTimerRunning(false);}} className="px-4 py-2 bg-gray-500 text-white rounded">🔄 重置</button>
                </div>
              </div>
            )}
            
            {activeTab === 'sgf' && (
              <div className="flex flex-wrap gap-2 justify-center">
                <button onClick={()=>{navigator.clipboard.writeText(generateSGFFromState()); alert('已复制SGF!');}} className="px-4 py-2 bg-blue-500 text-white rounded">📋 复制SGF</button>
                <button onClick={()=>{const s=generateSGFFromState(); const b=new Blob([s],{type:'text/plain'}); const u=URL.createObjectURL(b); const a=document.createElement('a'); a.href=u; a.download=gameName+'.sgf'; a.click();}} className="px-4 py-2 bg-green-500 text-white rounded">💾 下载</button>
              </div>
            )}
            
            {activeTab === 'review' && moveHistory.length > 0 && (
              <div>
                <div className="flex justify-center gap-1 mb-2">
                  <button onClick={()=>goToReviewMove(0)} disabled={reviewMove===0} className="px-2 py-1 bg-gray-200 rounded text-xs disabled:opacity-50">⏮</button>
                  <button onClick={()=>goToReviewMove(reviewMove-1)} disabled={reviewMove===0} className="px-2 py-1 bg-gray-200 rounded text-xs disabled:opacity-50">◀</button>
                  <button onClick={()=>goToReviewMove(reviewMove+1)} disabled={reviewMove>=moveHistory.length} className="px-2 py-1 bg-gray-200 rounded text-xs disabled:opacity-50">▶</button>
                  <button onClick={()=>goToReviewMove(moveHistory.length)} disabled={reviewMove>=moveHistory.length} className="px-2 py-1 bg-gray-200 rounded text-xs disabled:opacity-50">⏭</button>
                </div>
                <div className="text-center text-xs mb-1">当前: {reviewMove} / {moveHistory.length} 手</div>
                <div className="h-1.5 bg-gray-200 rounded-full mb-2"><div className="h-full bg-blue-500" style={{width: (reviewMove/moveHistory.length*100)+'%'}}/></div>
                <input type="number" min={0} max={moveHistory.length} value={reviewMove} onChange={e=>goToReviewMove(parseInt(e.target.value)||0)} className="w-full border rounded px-2 py-1 text-center text-sm"/>
              </div>
            )}
            {activeTab === 'review' && moveHistory.length === 0 && (
              <div className="text-center text-gray-500 text-sm">落子后自动记录历史棋步</div>
            )}
            
            {activeTab === 'mark' && (
              <div className="text-center">
                <label className="flex items-center justify-center gap-2">
                  <input type="checkbox" checked={markMode} onChange={e=>setMarkMode(e.target.checked)}/>
                  <span>标记模式</span>
                </label>
              </div>
            )}
          </div>
        )}
      </div>
<div className="mt-2 text-xs text-gray-500">
        <p>💡 棋子精确落在交叉点上，坐标清晰显示，基础提子功能已实现</p>
        <p>🎯 点击交叉点落子，星位标识清晰可见</p>
      </div>
    </div>
  )
}

export default WeiqiBoard