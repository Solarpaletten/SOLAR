try {
  // Тест всех импортов из githubService.js
  const { Octokit } = require('@octokit/rest');
  const simpleGit = require('simple-git');
  const fs = require('fs').promises;
  const path = require('path');
  
  console.log('✅ All githubService dependencies working');
  
  // Тест импорта из cloudIdeController.js  
  const { diffLines } = require('diff');
  console.log('✅ All cloudIdeController dependencies working');
  
  console.log('🎊 Solar Cloud IDE backend ready!');
} catch (error) {
  console.error('❌ Service test error:', error.message);
}
