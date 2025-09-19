# Branch Protection Recommendations

## Main Branch Protection Rules

To protect your main branch and ensure code quality, consider implementing these branch protection rules in your GitHub repository settings:

### Required Settings:

1. **Require a pull request before merging**
   - Require approvals: 1
   - Dismiss stale PR approvals when new commits are pushed
   - Require review from code owners

2. **Require status checks to pass before merging**
   - Require branches to be up to date before merging
   - Add required status checks:
     - Jekyll build check
     - CSS/SCSS validation
     - Image optimization check

3. **Require conversation resolution before merging**
   - All conversations on code must be resolved

4. **Restrict pushes that create files**
   - Prevent direct pushes to main branch
   - Require all changes to go through pull requests

5. **Allow force pushes**
   - Disable force pushes to main branch

6. **Allow deletions**
   - Disable branch deletion

### Additional Recommendations:

- Set up automated testing for CSS/SCSS compilation
- Add image optimization checks
- Configure automatic dependency updates with Dependabot
- Set up security scanning with CodeQL

### How to Apply:

1. Go to your repository on GitHub
2. Navigate to Settings → Branches
3. Click "Add rule" for the main branch
4. Configure the settings above
5. Save changes

This will help maintain code quality and prevent accidental changes to your production site.
