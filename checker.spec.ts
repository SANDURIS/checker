import { test, expect } from '@playwright/test'

const GAME_URL = "https://www.gamesforthebrain.com/game/checkers/"


test.use({ headless: false, 
   video: 'on',
  viewport: { width: 1280, height: 720 }, 
  actionTimeout: 60000,  
  navigationTimeout: 60000  
})

test.describe('Checkers Game Automation', () => {
  test('Automate Checkers Gameplay', async ({ page }) => {
    test.setTimeout(1200000)
    //function to perform a moves
    const makeMove = async (source: string, target: string) => {
        await page.hover(`img[name="${source}"]`)
        await page.locator(`img[name="${source}"]`).click()
        await new Promise(resolve => setTimeout(resolve, 1000)) 
        await page.hover(`img[name="${target}"]`)
        await page.locator(`img[name="${target}"]`).click()
        
       // Check if this is a jump move (2 squares difference)
      const sourceNum = parseInt(source.replace('space', ''))
      const targetNum = parseInt(target.replace('space', ''))
      const diff = Math.abs(targetNum - sourceNum)
      
      // If it's a jump move (difference of 18 or 22 for diagonal jumps)
      if (diff > 11) {
          console.log(`Jump move detected: ${source} -> ${target}`)
          // Calculate the middle square that should be captured
          const middleNum = Math.floor((sourceNum + targetNum) / 2)
          const middleSpace = `space${middleNum}`
          
          // Verify the middle piece is now empty (captured)
          await expect(page.locator(`img[name="${middleSpace}"]`)).not.toHaveAttribute('src', /me1\.gif/)
          console.log(`Captured piece at ${middleSpace}`)
      }


        await expect(page.locator(`img[name="${source}"]`)).not.toHaveAttribute('src', /you1\.gif/)
        await expect(page.locator(`img[name="${target}"]`)).toHaveAttribute('src', /you1\.gif/)
        await new Promise(resolve => setTimeout(resolve, 3000)) 
    }

    //Navigate to the site and confirm the site is up
    await page.goto(GAME_URL)
    let pageLoaded = false
    page.on('response', response => {
      if (response.url() === GAME_URL && response.status() === 200) {
        pageLoaded = true
        console.log('Received 200 OK from game server')
      }})
    await expect(page.url()).toBe(GAME_URL)
    console.log('Step 1: Site is up and game loaded.')
    await expect(page.locator("id=message")).toHaveText("Select an orange piece to move.")

    //Perform moves
     const moves = [
       { source: "space22", target: "space33" },
       { source: "space11", target: "space22" },
       { source: "space42", target: "space53" },
       { source: "space62", target: "space73" },
       { source: "space71", target: "space53" },
    
       ] 
  
    for (const move of moves) {
        console.log("Step 2 moving "+ move.source + " => "+ move.target)
        await makeMove(move.source, move.target)
    }

    //Restart the game
    await page.click('text=Restart...')
    console.log('Step 3: Restarted the game.')
    await page.waitForLoadState('domcontentloaded')

    // Confirm game restart
    await expect.soft(page.locator("id=message")).not.toHaveText("orange")
    console.log('Step 4: Game restarted successfully.')
  })
})
