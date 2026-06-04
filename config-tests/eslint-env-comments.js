
// 1. Own line — whole line must be removed
const el = document.getElementById('app')

// 2. Multiple envs on one comment
function read() {
  return process.env.NODE_ENV
}

// 3. Extra whitespace inside comment
const win = window.location

// 4. Inline with code — only comment removed, rest of line preserved
const url = location.href  + '/path'

// 5. Multiple comments on different lines
const x = 1

// 6. Comment at end of file
const y = 2
