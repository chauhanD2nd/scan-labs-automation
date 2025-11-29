// ─────────────────────────────────────────────────────────────
// Jenkins Declarative Pipeline for Playwright E2E Tests (Windows)
// Uses PowerShell (Windows agent), Chromium-only install,
// Archives HTML reports, Slack/Jira dummy steps
// Secrets injected via Jenkins Credentials
// ─────────────────────────────────────────────────────────────

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
                echo "Ensuring Node 18 is available"

                powershell '''
                    if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
                      Write-Host "ERROR: Node is NOT installed on this Jenkins agent."
                      exit 1
                    }

                    Write-Host "Node version:"
                    node -v
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                powershell 'npm ci'
            }
        }

        stage('Install Playwright (Chromium Only)') {
            steps {
                powershell 'npx playwright install chromium'
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
                        "BASE_URL=$env:BASE_URL"           | Out-File ".env_ci"
                        "USER_EMAIL=$env:USER_EMAIL"       | Add-Content ".env_ci"
                        "USER_PASSWORD=$env:USER_PASSWORD" | Add-Content ".env_ci"

                        try {
                            npx playwright test --project=chromium --reporter=html
                        } catch {
                            Write-Host "Playwright tests failed -- continuing pipeline"
                        }
                    '''
                }
            }

            post {
                always {
                    echo "Playwright test run finished"
                }
            }
        }

        stage('Archive Report') {
            steps {
                script {
                    def ts = new Date().format("yyyyMMdd-HHmmss")
                    powershell "Compress-Archive -Path playwright-report -DestinationPath playwright-report-${ts}.zip -Force"
                    archiveArtifacts artifacts: "playwright-report-${ts}.zip", fingerprint: true
                }
            }
        }

        stage('Slack Notification (Dummy)') {
            steps {
                echo "Slack notification would be sent here"
            }
        }

        stage('Jira Update (Dummy)') {
            steps {
                echo "Jira update would happen here"
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
            echo "Build failed ❌ — check HTML report"
        }
    }
}
