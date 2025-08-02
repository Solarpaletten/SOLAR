# 🌟 SOLAR CLOUD IDE - REVOLUTIONARY START
# "The Future of Development is Here"

echo "🚀 Starting Solar Cloud IDE Revolution..."

# ===============================================
# 1️⃣ INSTALL GITHUB INTEGRATION PACKAGES
# ===============================================

echo "📦 Installing GitHub integration..."

cd b
npm install simple-git @octokit/rest node-git-lfs chokidar

echo "✅ GitHub packages installed!"

# ===============================================
# 2️⃣ CREATE CLOUD IDE STRUCTURE
# ===============================================

echo "🏗️ Creating Cloud IDE structure..."

# Core Cloud IDE folders
mkdir -p src/services/cloudide
mkdir -p src/routes/cloudide
mkdir -p src/controllers/cloudide
mkdir -p src/middleware/cloudide

# GitHub integration
mkdir -p src/services/github
mkdir -p src/utils/git

# Live environment
mkdir -p src/services/live-env
mkdir -p src/sockets

echo "✅ Cloud IDE structure created!"

# ===============================================
# 3️⃣ CREATE GITHUB SERVICE
# ===============================================

echo "🐙 Creating GitHub integration service..."

cat > src/services/github/githubService.js << 'EOF'
// 🌟 Solar Cloud IDE - GitHub Integration Service
const { Octokit } = require('@octokit/rest');
const simpleGit = require('simple-git');
const fs = require('fs').promises;
const path = require('path');

class GitHubService {
  constructor() {
    this.octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN, // Optional for public repos
    });
    this.git = simpleGit();
  }

  // 📁 Load repository file tree
  async loadRepoTree(owner, repo, branch = 'main') {
    try {
      console.log(`🔍 Loading repo tree: ${owner}/${repo}@${branch}`);
      
      const { data } = await this.octokit.rest.git.getTree({
        owner,
        repo,
        tree_sha: branch,
        recursive: 'true'
      });

      // Filter for relevant files
      const files = data.tree
        .filter(item => 
          item.type === 'blob' && 
          /\.(js|jsx|ts|tsx|css|json|md)$/.test(item.path)
        )
        .map(item => ({
          path: item.path,
          sha: item.sha,
          size: item.size,
          type: path.extname(item.path).slice(1),
          name: path.basename(item.path),
          isComponent: this.isComponentFile(item.path)
        }));

      return {
        success: true,
        data: {
          repo: `${owner}/${repo}`,
          branch,
          totalFiles: files.length,
          files: files.sort((a, b) => a.path.localeCompare(b.path))
        }
      };

    } catch (error) {
      console.error('Error loading repo tree:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 📄 Get file content
  async getFileContent(owner, repo, filePath, branch = 'main') {
    try {
      console.log(`📄 Getting file: ${owner}/${repo}/${filePath}@${branch}`);
      
      const { data } = await this.octokit.rest.repos.getContent({
        owner,
        repo,
        path: filePath,
        ref: branch
      });

      if (data.type !== 'file') {
        throw new Error('Not a file');
      }

      const content = Buffer.from(data.content, 'base64').toString('utf8');
      
      return {
        success: true,
        data: {
          path: filePath,
          content,
          size: data.size,
          sha: data.sha,
          encoding: data.encoding,
          lastModified: data._links?.git || null
        }
      };

    } catch (error) {
      console.error('Error getting file content:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 🔍 Compare with local file
  async compareWithLocal(repoFile, localPath = './f/src') {
    try {
      const fullLocalPath = path.join(localPath, repoFile.path);
      
      let localContent = '';
      let localExists = false;
      
      try {
        localContent = await fs.readFile(fullLocalPath, 'utf8');
        localExists = true;
      } catch (error) {
        // File doesn't exist locally
        localExists = false;
      }

      const comparison = {
        path: repoFile.path,
        localExists,
        repoContent: repoFile.content,
        localContent,
        status: this.getComparisonStatus(repoFile.content, localContent, localExists)
      };

      return {
        success: true,
        data: comparison
      };

    } catch (error) {
      console.error('Error comparing files:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 🌿 Get repository branches
  async getBranches(owner, repo) {
    try {
      const { data } = await this.octokit.rest.repos.listBranches({
        owner,
        repo
      });

      return {
        success: true,
        data: data.map(branch => ({
          name: branch.name,
          sha: branch.commit.sha,
          protected: branch.protected
        }))
      };

    } catch (error) {
      console.error('Error getting branches:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 🔍 Search repositories
  async searchRepos(query, user = null) {
    try {
      const searchQuery = user ? `${query} user:${user}` : query;
      
      const { data } = await this.octokit.rest.search.repos({
        q: searchQuery,
        sort: 'updated',
        order: 'desc',
        per_page: 10
      });

      return {
        success: true,
        data: data.items.map(repo => ({
          name: repo.name,
          fullName: repo.full_name,
          owner: repo.owner.login,
          description: repo.description,
          language: repo.language,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          updated: repo.updated_at,
          private: repo.private
        }))
      };

    } catch (error) {
      console.error('Error searching repos:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 🔧 Helper methods
  isComponentFile(filePath) {
    const componentPatterns = [
      /components?\/.*\.(jsx?|tsx?)$/,
      /pages?\/.*\.(jsx?|tsx?)$/,
      /views?\/.*\.(jsx?|tsx?)$/,
      /containers?\/.*\.(jsx?|tsx?)$/
    ];
    
    return componentPatterns.some(pattern => pattern.test(filePath));
  }

  getComparisonStatus(repoContent, localContent, localExists) {
    if (!localExists) {
      return 'new';
    }
    
    if (repoContent === localContent) {
      return 'identical';
    }
    
    return 'modified';
  }
}

module.exports = GitHubService;
EOF

# ===============================================
# 4️⃣ CREATE CLOUD IDE CONTROLLER
# ===============================================

echo "🎮 Creating Cloud IDE controller..."

cat > src/controllers/cloudide/cloudIdeController.js << 'EOF'
// 🌟 Solar Cloud IDE - Main Controller
const GitHubService = require('../../services/github/githubService');
const { diffLines } = require('diff');

const githubService = new GitHubService();

const cloudIdeController = {
  // 🐙 Load GitHub repository
  loadRepo: async (req, res) => {
    try {
      const { owner, repo, branch = 'main' } = req.body;
      
      if (!owner || !repo) {
        return res.status(400).json({
          success: false,
          error: 'Owner and repo are required'
        });
      }

      const result = await githubService.loadRepoTree(owner, repo, branch);
      
      res.json({
        success: result.success,
        data: result.data,
        message: result.success 
          ? `Repository ${owner}/${repo} loaded successfully`
          : result.error
      });

    } catch (error) {
      console.error('Error in loadRepo:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to load repository',
        details: error.message
      });
    }
  },

  // 📄 Get file from GitHub
  getFile: async (req, res) => {
    try {
      const { owner, repo, filePath, branch = 'main' } = req.query;
      
      if (!owner || !repo || !filePath) {
        return res.status(400).json({
          success: false,
          error: 'Owner, repo, and filePath are required'
        });
      }

      const result = await githubService.getFileContent(owner, repo, filePath, branch);
      
      res.json({
        success: result.success,
        data: result.data,
        message: result.success 
          ? `File ${filePath} loaded successfully`
          : result.error
      });

    } catch (error) {
      console.error('Error in getFile:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get file',
        details: error.message
      });
    }
  },

  // 🔍 Compare GitHub file with local
  compareFile: async (req, res) => {
    try {
      const { owner, repo, filePath, branch = 'main', newCode } = req.body;
      
      if (!owner || !repo || !filePath) {
        return res.status(400).json({
          success: false,
          error: 'Owner, repo, and filePath are required'
        });
      }

      // Get file from GitHub
      const repoResult = await githubService.getFileContent(owner, repo, filePath, branch);
      if (!repoResult.success) {
        return res.json(repoResult);
      }

      const repoFile = repoResult.data;
      
      // Compare with local or provided code
      const compareCode = newCode || '';
      const codeToCompare = newCode ? newCode : repoFile.content;
      
      // Compare with local file
      const localResult = await githubService.compareWithLocal(repoFile);
      
      // Generate diff
      const diff = diffLines(repoFile.content, codeToCompare);
      
      // AI Analysis
      const analysis = {
        lines: {
          repo: repoFile.content.split('\n').length,
          compare: codeToCompare.split('\n').length,
          diff: diff.filter(part => part.added || part.removed).length
        },
        patterns: this.detectPatterns(codeToCompare),
        status: this.getFileStatus(repoFile.content, codeToCompare, localResult.data?.localExists)
      };

      res.json({
        success: true,
        data: {
          repo: `${owner}/${repo}`,
          branch,
          file: {
            path: filePath,
            repoContent: repoFile.content,
            compareContent: codeToCompare,
            localExists: localResult.data?.localExists || false
          },
          diff,
          analysis,
          timestamp: new Date().toISOString()
        },
        message: 'File comparison completed'
      });

    } catch (error) {
      console.error('Error in compareFile:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to compare file',
        details: error.message
      });
    }
  },

  // 🌿 Get repository branches
  getBranches: async (req, res) => {
    try {
      const { owner, repo } = req.query;
      
      if (!owner || !repo) {
        return res.status(400).json({
          success: false,
          error: 'Owner and repo are required'
        });
      }

      const result = await githubService.getBranches(owner, repo);
      
      res.json({
        success: result.success,
        data: result.data,
        message: result.success 
          ? `Branches for ${owner}/${repo} loaded`
          : result.error
      });

    } catch (error) {
      console.error('Error in getBranches:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get branches',
        details: error.message
      });
    }
  },

  // 🔍 Search repositories
  searchRepos: async (req, res) => {
    try {
      const { query, user } = req.query;
      
      if (!query) {
        return res.status(400).json({
          success: false,
          error: 'Search query is required'
        });
      }

      const result = await githubService.searchRepos(query, user);
      
      res.json({
        success: result.success,
        data: result.data,
        message: result.success 
          ? `Found ${result.data?.length || 0} repositories`
          : result.error
      });

    } catch (error) {
      console.error('Error in searchRepos:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to search repositories',
        details: error.message
      });
    }
  },

  // 🔧 Helper methods
  detectPatterns(code) {
    const patterns = [];
    
    if (code.includes('useState') || code.includes('useEffect')) {
      patterns.push('React Hooks');
    }
    if (code.includes('interface ') || code.includes(': React.FC')) {
      patterns.push('TypeScript');
    }
    if (code.includes('className') && code.includes('bg-')) {
      patterns.push('Tailwind CSS');
    }
    if (code.includes('drag') || code.includes('Drop')) {
      patterns.push('Drag & Drop');
    }
    if (code.includes('prisma') || code.includes('@prisma')) {
      patterns.push('Prisma ORM');
    }
    
    return patterns;
  },

  getFileStatus(repoContent, compareContent, localExists) {
    if (repoContent === compareContent) {
      return 'identical';
    }
    
    if (!localExists) {
      return 'new';
    }
    
    return 'modified';
  }
};

module.exports = cloudIdeController;
EOF

# ===============================================
# 5️⃣ CREATE ROUTES
# ===============================================

echo "🛣️ Creating Cloud IDE routes..."

cat > src/routes/cloudide/cloudIdeRoutes.js << 'EOF'
// 🌟 Solar Cloud IDE - Routes
const express = require('express');
const router = express.Router();
const cloudIdeController = require('../../controllers/cloudide/cloudIdeController');
const auth = require('../../middleware/auth');

// 🧪 Health Check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'Solar Cloud IDE',
    version: '1.0.0',
    features: [
      'GitHub Integration',
      'Live File Comparison',
      'AI Code Analysis',
      'Real-time Diff',
      'Branch Management'
    ],
    status: 'operational',
    timestamp: new Date().toISOString()
  });
});

// 🐙 GitHub Integration
router.post('/repo/load', auth, cloudIdeController.loadRepo);
router.get('/repo/file', auth, cloudIdeController.getFile);
router.post('/repo/compare', auth, cloudIdeController.compareFile);
router.get('/repo/branches', auth, cloudIdeController.getBranches);
router.get('/repo/search', auth, cloudIdeController.searchRepos);

module.exports = router;
EOF

echo "✅ Cloud IDE backend foundation created!"

# ===============================================
# 6️⃣ REGISTRATION INSTRUCTIONS
# ===============================================

echo ""
echo "🔧 MANUAL REGISTRATION REQUIRED:"
echo ""
echo "Add to b/src/app.js:"
echo "const cloudIdeRoutes = require('./routes/cloudide/cloudIdeRoutes');"
echo "app.use('/api/cloudide', cloudIdeRoutes);"
echo ""
echo "✅ Backend foundation ready!"
echo ""
echo "🚀 NEXT: Frontend Cloud IDE interface..."
echo ""