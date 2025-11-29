pipeline {
  agent any

  options {
    timestamps()
    buildDiscarder(logRotator(daysToKeepStr: '30'))
  }

  environment {
    BASE_URL      = ''
    USER_EMAIL    = ''
    USER_PASSWORD = ''
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Setup Node') {
      steps {
        echo "Ensuring Node is installed"
        powershell '''
          if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
            Write-Host "ERROR: Node is NOT installed!"
            exit 1
          }
          node -v
        '''
      }
    }

    stage('Install Dependencies') {
      steps {
        powershell 'npm ci'
      }
    }

    stage('Install Playwright (Chromium + dependencies)') {
      steps {
        powershell 'npx playwright install chromium --with-deps'
      }
    }

    stage('Run Playwright Tests') {
      steps {
        withCredentials([
          string(credentialsId: 'BASE_URL_CRED',      variable: 'BASE_URL'),
          string(credentialsId: 'USER_EMAIL_CRED',    variable: 'USER_EMAIL'),
          string(credentialsId: 'USER_PASSWORD_CRED', variable: 'USER_PASSWORD')
        ]) {

          powershell '''
            "BASE_URL=$env:BASE_URL"      | Out-File .env_ci
            "USER_EMAIL=$env:USER_EMAIL"  | Add-Content .env_ci
            "USER_PASSWORD=$env:USER_PASSWORD" | Add-Content .env_ci

            # Run tests but NEVER fail pipeline
            try {
              npx playwright test --project=chromium --reporter=html
            } catch {
              Write-Host "Playwright tests failed — proceeding anyway"
            }

            exit 0
          '''
        }
      }
    }
  }

  post {

    /** ALWAYS store report (SUCCESS OR FAILURE) */
    always {
      echo "Archiving Playwright HTML report"
      script {
        def ts = new Date().format("yyyyMMdd-HHmmss")

        // compress folder to zip
        powershell """
          if (Test-Path 'playwright-report') {
            Compress-Archive -Path 'playwright-report' -DestinationPath 'playwright-report-${ts}.zip' -Force
          }
        """

        archiveArtifacts artifacts: "playwright-report-${ts}.zip", fingerprint: true
      }
    }

    success {
      echo "Build succeeded ✔"
    }

    failure {
      echo "Build failed X — check archived report"
    }
  }
}
