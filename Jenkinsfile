pipeline {
  agent any

  options {
    timestamps()
    buildDiscarder(logRotator(daysToKeepStr: '30'))
  }

  environment {
    BASE_URL = ''
    USER_EMAIL = ''
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
        echo "Ensuring Node 18 is available"

        bat '''
        node -v
        '''
      }
    }

    stage('Install Dependencies') {
      steps {
        bat 'npm ci'
      }
    }

    stage('Install Playwright (Chromium Only)') {
      steps {
        bat 'npx playwright install chromium'
      }
    }

    stage('Run Playwright Tests') {
      steps {
        withCredentials([
          string(credentialsId: 'BASE_URL_CRED',     variable: 'BASE_URL'),
          string(credentialsId: 'USER_EMAIL_CRED',   variable: 'USER_EMAIL'),
          string(credentialsId: 'USER_PASSWORD_CRED', variable: 'USER_PASSWORD')
        ]) {

          bat """
          echo BASE_URL=%BASE_URL% > .env_ci
          echo USER_EMAIL=%USER_EMAIL% >> .env_ci
          echo USER_PASSWORD=%USER_PASSWORD% >> .env_ci

          npx playwright test --project=chromium --reporter=html
          """
        }
      }
    }

    stage('Archive Report') {
      steps {
        script {
          def ts = new Date().format("yyyyMMdd-HHmmss")

          // Zip on Windows
          bat """
          powershell Compress-Archive -Path playwright-report -DestinationPath playwright-report-${ts}.zip -Force
          """

          archiveArtifacts artifacts: "playwright-report-${ts}.zip", fingerprint: true
        }
      }
    }
  }

  post {
    always {
      echo "Pipeline completed"
    }
    success {
      echo "Build succeeded ✔"
    }
    failure {
      echo "Build failed ❌ — Check HTML report"
    }
  }
}
