// ─────────────────────────────────────────────
// Jenkins Declarative Pipeline for Playwright
// Runs Chromium-only tests, archives HTML report
// Secrets are injected via Jenkins Credentials
// ─────────────────────────────────────────────

pipeline {

  agent any   // run on any available agent

  options {
    timestamps()                             // add timestamps to logs
    buildDiscarder(logRotator(daysToKeepStr: '30'))   // keep logs 30 days
  }

  environment {
    // placeholders (values injected later using withCredentials)
    BASE_URL      = ''
    USER_EMAIL    = ''
    USER_PASSWORD = ''
  }

  stages {

    stage('Checkout') {
      steps {
        // Pull code from GitHub repository
        checkout scm
      }
    }

    stage('Setup Node') {
      steps {
        // Ensure Node.js is installed on agent
        echo "Ensuring Node 18 is available"
        sh '''
          if ! command -v node >/dev/null 2>&1 ; then
            echo "ERROR: Node not installed on Jenkins agent."
            exit 1
          fi

          echo "Node version:"
          node -v
        '''
      }
    }

    stage('Install Dependencies') {
      steps {
        // Install npm dependencies cleanly
        sh 'npm ci'
      }
    }

    stage('Install Playwright (Chromium Only)') {
      steps {
        // Install ONLY Chromium to speed up Jenkins build
        sh 'npx playwright install chromium --with-deps'
      }
    }

    stage('Run Playwright Tests') {
      steps {

        // Inject Jenkins credentials into environment variables
        withCredentials([
          string(credentialsId: 'BASE_URL_CRED', variable: 'BASE_URL'),
          string(credentialsId: 'USER_EMAIL_CRED', variable: 'USER_EMAIL'),
          string(credentialsId: 'USER_PASSWORD_CRED', variable: 'USER_PASSWORD')
        ]) {

          // Create env file and run tests
          sh '''
            echo "BASE_URL=$BASE_URL" > .env_ci
            echo "USER_EMAIL=$USER_EMAIL" >> .env_ci
            echo "USER_PASSWORD=$USER_PASSWORD" >> .env_ci

            npx playwright test --project=chromium --reporter=html
          '''
        }
      }

      post {
        always {
          echo "Collecting Playwright HTML report"
        }
      }
    }

    stage('Archive Report') {
      steps {
        script {
          // Generate timestamp such as 20250115-093301
          def ts = new Date().format("yyyyMMdd-HHmmss")

          echo "Creating timestamped artifact"

          // Compress Playwright HTML report folder
          sh "zip -r playwright-report-${ts}.zip playwright-report || true"

          // Make available in Jenkins UI
          archiveArtifacts artifacts: "playwright-report-${ts}.zip", fingerprint: true
        }
      }
    }
  }

  post {
    always {
      echo "Pipeline finished (post block)"
    }
    success {
      echo "Build passed ✔"
    }
    failure {
      echo "Build failed ❌ — Open HTML report in Jenkins Artifacts"
    }
  }
}
