import styles from "./maintenance.styles.module.scss";



export default function MaintenancePage() {
    return (
        <div className={styles.maintenanceContainer}>
            <div className={styles.maintenanceContent}>
                <h1>We&apos;re Under Maintenance</h1>
                <h2>
                    <span>Color It Daily</span> is currently down for
                    maintenance.
                </h2>
                <h2>We&apos;ll be back soon!</h2>

                <div className={styles.imageContainer}>
                    <img
                        src="/beaver-maintenance.png"
                        alt="Coloring Pages Logo"
                        className={styles.image}
                        width="100%"
                        height="auto"
                    />
                </div>
            </div>
        </div>
    );
}
